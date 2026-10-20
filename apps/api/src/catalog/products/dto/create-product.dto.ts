import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '@prisma/client';

export class CreateVariantDto {
  @IsString()
  sku!: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;
}

export class CreateProductDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  categoryName?: string;

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  /** Optional top-level price for single-SKU product creation */
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  /** Optional top-level initial stock for single-SKU product creation */
  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  /** Optional explicit SKU for top-level single-SKU creation */
  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  @IsOptional()
  tagline?: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsString()
  @IsOptional()
  moodAndCharacter?: string;

  @IsString()
  @IsOptional()
  olfactoryStory?: string;

  @IsString()
  @IsOptional()
  ingredients?: string;

  @IsOptional()
  features?: any;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsOptional()
  regionalPrices?: Record<string, number>;

  /** Optional array of variants — if empty or omitted, a default variant is auto-created */
  @IsArray()
  @IsOptional()
  variants?: any[];
}

