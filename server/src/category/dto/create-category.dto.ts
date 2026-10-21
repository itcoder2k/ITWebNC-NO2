import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Tên danh mục (name) không được để trống' })
  @IsString({ message: 'Tên danh mục phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Tên danh mục tối đa 100 ký tự' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Slug phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Slug tối đa 100 ký tự' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug phải ở định dạng kebab-case (chỉ gồm chữ thường, số và dấu gạch ngang)',
  })
  slug?: string;

  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;
}