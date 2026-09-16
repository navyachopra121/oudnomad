import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentAttemptDto {
  @IsString()
  @IsNotEmpty()
  idempotencyKey!: string;
}
