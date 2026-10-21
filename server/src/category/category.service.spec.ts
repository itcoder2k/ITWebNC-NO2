import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService, slugify } from './category.service.js';
import { ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockCategoryRepo: any;

  beforeEach(async () => {
    mockCategoryRepo = {
      create: vi.fn((dto) => ({ ...dto })),
      save: vi.fn((entity) => Promise.resolve({ category_id: 1, ...entity })),
      find: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn((entity) => Promise.resolve(entity)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: 'CATEGORY_REPOSITORY',
          useValue: mockCategoryRepo,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('slugify helper', () => {
    it('should convert Vietnamese text with accents to slug', () => {
      expect(slugify('Đồ Họa Game 2D')).toBe('do-hoa-game-2d');
      expect(slugify('Hiệu Ứng Hình Ảnh & VFX')).toBe('hieu-ung-hinh-anh-vfx');
      expect(slugify('Âm Thanh & SFX')).toBe('am-thanh-sfx');
    });

    it('should strip special characters and multi-hyphens', () => {
      expect(slugify('Game UI / HUD Kit (Figma)!!')).toBe('game-ui-hud-kit-figma');
    });
  });

  describe('create', () => {
    it('should create a category and auto-generate slug if omitted', async () => {
      mockCategoryRepo.findOne.mockResolvedValue(null);

      const dto = { name: '2D Game Assets', description: 'Spritesheets and pixel art' };
      const result = await service.create(dto);

      expect(mockCategoryRepo.create).toHaveBeenCalledWith({
        name: '2D Game Assets',
        slug: '2d-game-assets',
        description: 'Spritesheets and pixel art',
      });
      expect(result).toHaveProperty('category_id', 1);
      expect(result).toHaveProperty('slug', '2d-game-assets');
    });

    it('should create a category with custom slug if provided', async () => {
      mockCategoryRepo.findOne.mockResolvedValue(null);

      const dto = { name: '3D Models', slug: 'custom-3d-slug' };
      const result = await service.create(dto);

      expect(mockCategoryRepo.create).toHaveBeenCalledWith({
        name: '3D Models',
        slug: 'custom-3d-slug',
        description: undefined,
      });
      expect(result.slug).toBe('custom-3d-slug');
    });

    it('should throw ConflictException if category name already exists', async () => {
      mockCategoryRepo.findOne.mockResolvedValue({
        category_id: 1,
        name: '2D Game Assets',
        slug: '2d-game-assets',
      });

      const dto = { name: '2D Game Assets' };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if slug already exists', async () => {
      mockCategoryRepo.findOne.mockResolvedValue({
        category_id: 1,
        name: 'Existing Asset Category',
        slug: 'game-assets',
      });

      const dto = { name: 'New Assets', slug: 'game-assets' };
      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [
        { category_id: 1, name: '2D Game Assets', slug: '2d-game-assets' },
        { category_id: 2, name: '3D Models', slug: '3d-models' },
      ];
      mockCategoryRepo.find.mockResolvedValue(categories);

      const result = await service.findAll();
      expect(result).toEqual(categories);
      expect(mockCategoryRepo.find).toHaveBeenCalledWith({
        order: { category_id: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a category when found', async () => {
      const category = { category_id: 1, name: '2D Game Assets', slug: '2d-game-assets' };
      mockCategoryRepo.findOne.mockResolvedValue(category);

      const result = await service.findOne(1);
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException when category not found', async () => {
      mockCategoryRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return a category when slug is found', async () => {
      const category = { category_id: 1, name: '2D Game Assets', slug: '2d-game-assets' };
      mockCategoryRepo.findOne.mockResolvedValue(category);

      const result = await service.findBySlug('2d-game-assets');
      expect(result).toEqual(category);
    });

    it('should throw NotFoundException when slug not found', async () => {
      mockCategoryRepo.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('unknown-slug')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update category fields successfully', async () => {
      const existing = { category_id: 1, name: '2D Assets', slug: '2d-assets', description: 'Old' };
      mockCategoryRepo.findOne
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(null);

      const updateDto = { name: '2D Game Assets', description: 'Updated description' };
      const result = await service.update(1, updateDto);

      expect(result.name).toBe('2D Game Assets');
      expect(result.slug).toBe('2d-game-assets');
      expect(result.description).toBe('Updated description');
    });

    it('should throw ConflictException if updating to a name/slug of another category', async () => {
      const existing = { category_id: 1, name: '2D Assets', slug: '2d-assets' };
      const conflicting = { category_id: 2, name: '3D Models', slug: '3d-models' };

      mockCategoryRepo.findOne
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(conflicting);

      await expect(service.update(1, { name: '3D Models' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should remove category successfully', async () => {
      const category = { category_id: 1, name: '2D Game Assets', slug: '2d-game-assets' };
      mockCategoryRepo.findOne.mockResolvedValue(category);

      const result = await service.remove(1);
      expect(mockCategoryRepo.remove).toHaveBeenCalledWith(category);
      expect(result.message).toContain('Đã xóa danh mục #1');
    });

    it('should throw NotFoundException when category to remove does not exist', async () => {
      mockCategoryRepo.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
