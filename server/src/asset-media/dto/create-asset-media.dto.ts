import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { MediaType } from '../entities/asset-media.entity.js';

export class CreateAssetMediaDto {
  @IsNotEmpty({ message: 'asset_id không được để trống' })
  @IsInt({ message: 'asset_id phải là số nguyên' })
  asset_id: number;

  @IsNotEmpty({ message: 'media_url không được để trống' })
  @IsString({ message: 'media_url phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'media_url tối đa 255 ký tự' })
  media_url: string;

  @IsNotEmpty({ message: 'media_type không được để trống' })
  @IsEnum(MediaType, {
    message: 'media_type phải là một trong các giá trị: image, gif, audio, video',
  })
  media_type: MediaType;

  @IsOptional()
  @IsInt({ message: 'display_order phải là số nguyên' })
  @Min(0, { message: 'display_order không được âm' })
  display_order?: number;
}
