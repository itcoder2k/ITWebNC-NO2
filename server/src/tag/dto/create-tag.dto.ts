import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: 'Tên thẻ (name) không được để trống' })
  @IsString({ message: 'Tên thẻ phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Tên thẻ tối đa 50 ký tự' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Slug phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Slug tối đa 50 ký tự' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug phải ở định dạng kebab-case (chỉ gồm chữ thường, số và dấu gạch ngang)',
  })
  slug?: string;
}
