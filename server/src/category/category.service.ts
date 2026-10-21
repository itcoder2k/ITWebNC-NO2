import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

export function slugify(text: string): string {
  return text
    .toString()
    .replace(/[đĐ]/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

@Injectable()
export class CategoryService {
  private readonly categoryRepository: Repository<Category>;

  constructor(
    @Optional()
    @InjectRepository(Category)
    typeormCategoryRepo?: Repository<Category>,
    @Optional()
    @Inject('CATEGORY_REPOSITORY')
    customCategoryRepo?: Repository<Category>,
  ) {
    this.categoryRepository = (typeormCategoryRepo ?? customCategoryRepo)!;
  }

  // ==========================================
  // BUSINESS LOGIC: CATEGORY MANAGEMENT (TẦNG NGHIỆP VỤ)
  // ==========================================

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const name = createCategoryDto.name.trim();
    const slug = (createCategoryDto.slug?.trim() || slugify(name)).toLowerCase();

    if (!slug) {
      throw new BadRequestException('Không thể tạo slug hợp lệ từ tên danh mục');
    }

    const existingCategory = await this.categoryRepository.findOne({
      where: [{ name }, { slug }],
    });

    if (existingCategory) {
      if (existingCategory.name.toLowerCase() === name.toLowerCase()) {
        throw new ConflictException(`Danh mục '${name}' đã tồn tại`);
      }
      if (existingCategory.slug === slug) {
        throw new ConflictException(`Slug '${slug}' đã được sử dụng`);
      }
    }

    const newCategory = this.categoryRepository.create({
      name,
      slug,
      description: createCategoryDto.description?.trim(),
    });

    return await this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find({
      order: { category_id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { category_id: id },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID: ${id}`);
    }

    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const formattedSlug = slug.trim().toLowerCase();
    const category = await this.categoryRepository.findOne({
      where: { slug: formattedSlug },
    });

    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với slug: '${slug}'`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name !== undefined) {
      category.name = updateCategoryDto.name.trim();
    }

    if (updateCategoryDto.slug !== undefined) {
      category.slug = updateCategoryDto.slug.trim().toLowerCase();
    } else if (updateCategoryDto.name !== undefined) {
      category.slug = slugify(category.name);
    }

    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description.trim();
    }

    const conflict = await this.categoryRepository.findOne({
      where: [{ name: category.name }, { slug: category.slug }],
    });

    if (conflict && conflict.category_id !== id) {
      throw new ConflictException(
        `Tên danh mục '${category.name}' hoặc slug '${category.slug}' đã thuộc về danh mục khác`,
      );
    }

    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { message: `Đã xóa danh mục #${id} ('${category.name}') thành công` };
  }
}