import { IsString, IsEnum, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { AddressType } from '@prisma/client';

export class UpdateAddressDto {
  @IsEnum(AddressType)
  @IsOptional()
  type?: AddressType;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  recipientName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  line1?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  line2?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(2)
  countryCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}

