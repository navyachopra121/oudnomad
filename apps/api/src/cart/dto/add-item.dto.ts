import { IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCartItemDto {
  @IsString()
  variantId!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;
}
