import { IsString, IsOptional, IsEnum, MaxLength, IsNumber, IsArray, Min } from 'class-validator';
import { ProductStatus } from '@prisma/client';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(150)
  name?: string;

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

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

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

  @IsArray()
  @IsOptional()
  variants?: any[];
}

