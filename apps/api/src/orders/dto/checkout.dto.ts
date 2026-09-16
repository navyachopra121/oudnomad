import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ShippingMethodEnum } from '@prisma/client';

export class CheckoutDto {
  @IsString()
  shippingAddressId!: string;

  @IsEnum(ShippingMethodEnum)
  @IsOptional()
  shippingMethod?: ShippingMethodEnum = ShippingMethodEnum.STANDARD;
}
