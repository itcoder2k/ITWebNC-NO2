import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  short_description?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  thumbnail_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  file_url?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  file_size?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  license?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  category_id?: number;
}
