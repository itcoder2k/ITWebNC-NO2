import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export class CheckoutItemDto {
  @IsInt()
  @Min(1)
  asset_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pay_amount: number;
}

export class CheckoutDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  asset_id?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pay_amount?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutItemDto)
  items?: CheckoutItemDto[];
}
