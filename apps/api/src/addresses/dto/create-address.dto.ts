import { IsString, IsEnum, IsOptional, IsBoolean, MaxLength, IsPhoneNumber } from 'class-validator';
import { AddressType } from '@prisma/client';

export class CreateAddressDto {
  @IsEnum(AddressType)
  type!: AddressType;

  @IsString()
  @MaxLength(100)
  recipientName!: string;

  @IsString()
  @MaxLength(200)
  line1!: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  line2?: string;

  @IsString()
  @MaxLength(100)
  city!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @IsString()
  @MaxLength(20)
  postalCode!: string;

  @IsString()
  @MaxLength(2)
  countryCode!: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
