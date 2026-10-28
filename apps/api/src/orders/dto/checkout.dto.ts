import {
  IsString,
  IsEnum,
  IsOptional,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShippingMethodEnum } from '@prisma/client';

export class CheckoutItemDto {
  @IsString()
  @IsOptional()
  variantId?: string;

  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  quantity!: number;
}

export class CheckoutDto {
  @IsString()
  @IsOptional()
  shippingAddressId?: string;

  @IsEnum(ShippingMethodEnum)
  @IsOptional()
  shippingMethod?: ShippingMethodEnum = ShippingMethodEnum.STANDARD;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  countryCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  @IsOptional()
  items?: CheckoutItemDto[];

  @IsOptional()
  isGift?: boolean;

  @IsString()
  @IsOptional()
  giftMessage?: string;
}
