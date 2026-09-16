import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCartItemDto {
  @IsNumber()
  @Type(() => Number)
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity!: number;
}
