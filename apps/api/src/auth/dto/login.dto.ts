import { IsEmail, IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  /** Optional guest session ID for cart continuity on login */
  @IsString()
  @IsOptional()
  guestSessionId?: string;
}
