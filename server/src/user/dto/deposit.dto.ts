import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class DepositDto {
  @IsNumber({}, { message: 'Số tiền nạp phải là một số hợp lệ' })
  @IsNotEmpty({ message: 'Số tiền nạp không được để trống' })
  @Min(1, { message: 'Số tiền nạp tối thiểu phải từ $1.00 trở lên' })
  amount: number;
}
