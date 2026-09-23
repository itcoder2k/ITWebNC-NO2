import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateAssetDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  thumbnail_url?: string;

  @IsNotEmpty()
  @IsString()
  file_url: string;

  @IsNotEmpty()
  @IsNumber()
  uploader_id: number;

  @IsNotEmpty()
  @IsNumber()
  category_id: number;
}
