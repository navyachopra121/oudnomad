import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
/**
 * Mark a route as publicly accessible — bypasses the global JwtAuthGuard.
 * Apply to: register, login, refresh, forgot-password, reset-password, verify-email.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
