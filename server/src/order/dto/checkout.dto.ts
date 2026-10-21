import { IsInt, IsNumber, Min } from 'class-validator';

export class CheckoutDto {
  @IsInt()
  @Min(1)
  asset_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pay_amount: number;
}
