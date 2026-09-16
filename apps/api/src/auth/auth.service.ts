import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import { CartService } from '../cart/cart.service.js';
import { KafkaProducerService } from '../kafka/kafka-producer.service.js';
import { hashPassword, verifyPassword } from './lib/password.js';
import { generateOpaqueToken, hashToken } from './lib/tokens.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { ResetPasswordDto } from './dto/reset-password.dto.js';
import type { Response } from 'express';
import { randomUUID } from 'crypto';

export interface TokenPair {
  accessToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly refreshTokenExpiryDays: number;
  private readonly resetTokenExpiryMin: number;
  private readonly emailVerifyExpiryHours: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
    private readonly cartService: CartService,
    private readonly kafka: KafkaProducerService,
  ) {
    this.refreshTokenExpiryDays =
      Number(this.config.get('REFRESH_TOKEN_EXPIRES_IN_DAYS') ?? 30);
    this.resetTokenExpiryMin =
      Number(this.config.get('PASSWORD_RESET_EXPIRES_IN_MIN') ?? 30);
    this.emailVerifyExpiryHours =
      Number(this.config.get('EMAIL_VERIFICATION_EXPIRES_IN_HOURS') ?? 24);
  }

  // ---------------------------------------------------------------------------
  // REGISTER
  // ---------------------------------------------------------------------------

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with that email already exists');
    }

    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
      select: { id: true, email: true, role: true, emailVerified: true },
    });

    // Issue email verification token
    const rawToken = generateOpaqueToken();
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(
          Date.now() + this.emailVerifyExpiryHours * 60 * 60 * 1000,
        ),
      },
    });

    // Send verification email (never await in non-critical path — log errors)
    this.mail.sendVerificationEmail(user.email, rawToken).catch((err: unknown) => {
      this.logger.error('Failed to send verification email', err);
    });

    this.logger.log(`User registered: ${user.id}`);
    return { message: 'Registration successful. Please verify your email.' };
  }

  // ---------------------------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------------------------

  async login(dto: LoginDto, res: Response): Promise<TokenPair> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    // Constant-time check: always run verifyPassword even if user not found
    const passwordMatch =
      user != null
        ? await verifyPassword(user.passwordHash, dto.password)
        : await verifyPassword(
            '$argon2id$v=19$m=19456,t=2,p=1$dummy', // dummy hash — keeps timing consistent
            dto.password,
          ).catch(() => false);

    if (!user || !passwordMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (dto.guestSessionId) {
      await this.cartService.mergeGuestCartIntoUserCart(user.id, dto.guestSessionId);
      res.clearCookie('guest_session_id', { path: '/' });
    }

    // Issue refresh token
    const rawRefresh = generateOpaqueToken();
    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawRefresh),
        expiresAt: new Date(
          Date.now() + this.refreshTokenExpiryDays * 24 * 60 * 60 * 1000,
        ),
      },
    });

    const accessToken = this.signAccessToken(user.id, user.role);
    this.setRefreshCookie(res, rawRefresh);

    this.logger.log(`User logged in: ${user.id}`);
    return { accessToken };
  }

  // ---------------------------------------------------------------------------
  // REFRESH — with rotation + theft detection
  // ---------------------------------------------------------------------------

  async refresh(refreshTokenCookie: string | undefined, res: Response): Promise<TokenPair> {
    if (!refreshTokenCookie) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const tokenHash = hashToken(refreshTokenCookie);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Theft detection — already-rotated token was replayed
    if (storedToken.revokedAt) {
      this.logger.warn(
        `SECURITY: Refresh token reuse detected for user ${storedToken.userId} — revoking all sessions`,
      );
      await this.prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      this.clearRefreshCookie(res);
      throw new UnauthorizedException(
        'Session invalidated — please log in again',
      );
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = storedToken.user;

    const { rawRefresh } = await this.prisma.$transaction(async (tx) => {
      // Revoke old token
      await tx.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });

      // Issue new refresh token
      const rawRefresh = generateOpaqueToken();
      await tx.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(rawRefresh),
          expiresAt: new Date(
            Date.now() + this.refreshTokenExpiryDays * 24 * 60 * 60 * 1000,
          ),
        },
      });

      return { rawRefresh };
    });

    const accessToken = this.signAccessToken(user.id, user.role);
    this.setRefreshCookie(res, rawRefresh);

    return { accessToken };
  }

  // ---------------------------------------------------------------------------
  // LOGOUT
  // ---------------------------------------------------------------------------

  async logout(refreshTokenCookie: string | undefined, res: Response): Promise<void> {
    if (refreshTokenCookie) {
      const tokenHash = hashToken(refreshTokenCookie);
      await this.prisma.refreshToken
        .update({
          where: { tokenHash },
          data: { revokedAt: new Date() },
        })
        .catch(() => {
          // Token not found — already revoked or invalid; safe to ignore
        });
    }
    this.clearRefreshCookie(res);
  }

  // ---------------------------------------------------------------------------
  // EMAIL VERIFICATION
  // ---------------------------------------------------------------------------

  async verifyEmail(rawToken: string): Promise<{ message: string }> {
    const tokenHash = hashToken(rawToken);
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    await this.prisma.$transaction([
      this.prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      }),
    ]);

    return { message: 'Email verified successfully' };
  }

  // ---------------------------------------------------------------------------
  // FORGOT PASSWORD
  // ---------------------------------------------------------------------------

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Always return the same message — never reveal whether email exists
    const genericMessage = {
      message: 'If that email exists, a reset link has been sent.',
    };

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.deletedAt) {
      return genericMessage;
    }

    const rawToken = generateOpaqueToken();
    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: new Date(Date.now() + this.resetTokenExpiryMin * 60 * 1000),
      },
    });

    // Publish to Kafka — the notification-worker will render and send the email
    this.kafka.publish({
      idempotencyKey: `password-reset-${user.id}-${randomUUID()}`,
      type: 'PASSWORD_RESET',
      recipient: user.email,
      payload: {
        userId: user.id,
        rawToken,
        expiresInMin: this.resetTokenExpiryMin,
      },
    }).catch((err: unknown) => {
      // Fallback: send directly via MailService if Kafka publish fails
      this.logger.warn('Kafka publish failed for PASSWORD_RESET; falling back to direct mail', err);
      this.mail.sendPasswordResetEmail(user.email, rawToken).catch((mailErr: unknown) => {
        this.logger.error('Failed to send password reset email (both Kafka and direct mail failed)', mailErr);
      });
    });

    return genericMessage;
  }

  // ---------------------------------------------------------------------------
  // RESET PASSWORD
  // ---------------------------------------------------------------------------

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = hashToken(dto.newPassword.length > 0 ? dto.token : dto.token);
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(dto.token) },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await hashPassword(dto.newPassword);

    await this.prisma.$transaction(async (tx) => {
      // Mark this token used
      await tx.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      });

      // Invalidate ALL other outstanding reset tokens for this user
      await tx.passwordResetToken.updateMany({
        where: { userId: record.userId, usedAt: null },
        data: { usedAt: new Date() },
      });

      // Revoke all active refresh tokens (password reset = kill all sessions)
      await tx.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      // Update password
      await tx.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      });
    });

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  // ---------------------------------------------------------------------------
  // PRIVATE HELPERS
  // ---------------------------------------------------------------------------

  private signAccessToken(userId: string, role: string): string {
    return this.jwt.sign({ sub: userId, role });
  }

  private setRefreshCookie(res: Response, rawToken: string): void {
    const maxAge =
      this.refreshTokenExpiryDays * 24 * 60 * 60 * 1000;
    const isProduction = this.config.get('NODE_ENV') === 'production';

    res.cookie('refresh_token', rawToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge,
      path: '/api/auth',
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.clearCookie('refresh_token', { path: '/api/auth' });
  }

  private async mergeGuestCart(
    tx: Parameters<Parameters<PrismaService['$transaction']>[0]>[0],
    userId: string,
    sessionId: string,
  ): Promise<void> {
    const guestCart = await tx.cart.findFirst({ where: { sessionId }, include: { items: true } });
    if (!guestCart) return;

    const userCart = await tx.cart.findFirst({ where: { userId }, include: { items: true } });

    if (!userCart) {
      // Simply reassign guest cart to user
      await tx.cart.update({
        where: { id: guestCart.id },
        data: { userId, sessionId: null },
      });
      return;
    }

    // User already has a cart — merge: sum quantities for matching variants
    for (const guestItem of guestCart.items) {
      const existing = userCart.items.find((i) => i.variantId === guestItem.variantId);
      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + guestItem.quantity },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: userCart.id,
            variantId: guestItem.variantId,
            quantity: guestItem.quantity,
            priceSnapshotMinor: guestItem.priceSnapshotMinor,
          },
        });
      }
    }

    // Delete guest cart
    await tx.cart.delete({ where: { id: guestCart.id } });
  }
}
