import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller.js';
import { CategoryService } from './category.service.js';

describe('CategoryController', () => {
  let controller: CategoryController;
  let mockCategoryService: any;

  beforeEach(async () => {
    mockCategoryService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findBySlug: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call categoryService.create and return created category', async () => {
      const dto = { name: 'Audio & SFX', slug: 'audio-sfx' };
      const expected = { category_id: 3, ...dto };
      mockCategoryService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(mockCategoryService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const expected = [
        { category_id: 1, name: '2D Game Assets', slug: '2d-game-assets' },
        { category_id: 2, name: '3D Models', slug: '3d-models' },
      ];
      mockCategoryService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();
      expect(mockCategoryService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('findBySlug', () => {
    it('should return a category by slug', async () => {
      const expected = { category_id: 1, name: '2D Game Assets', slug: '2d-game-assets' };
      mockCategoryService.findBySlug.mockResolvedValue(expected);

      const result = await controller.findBySlug('2d-game-assets');
      expect(mockCategoryService.findBySlug).toHaveBeenCalledWith('2d-game-assets');
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const expected = { category_id: 1, name: '2D Game Assets', slug: '2d-game-assets' };
      mockCategoryService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(1);
      expect(mockCategoryService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should call categoryService.update for patch update', async () => {
      const updateDto = { name: 'Updated 2D Assets' };
      const expected = { category_id: 1, name: 'Updated 2D Assets', slug: 'updated-2d-assets' };
      mockCategoryService.update.mockResolvedValue(expected);

      const result = await controller.update(1, updateDto);
      expect(mockCategoryService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expected);
    });

    it('should call categoryService.update for put update', async () => {
      const updateDto = { name: 'Updated 2D Assets' };
      const expected = { category_id: 1, name: 'Updated 2D Assets', slug: 'updated-2d-assets' };
      mockCategoryService.update.mockResolvedValue(expected);

      const result = await controller.putUpdate(1, updateDto);
      expect(mockCategoryService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should call categoryService.remove and return message', async () => {
      const expected = { message: 'Đã xóa danh mục #1 thành công' };
      mockCategoryService.remove.mockResolvedValue(expected);

      const result = await controller.remove(1);
      expect(mockCategoryService.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });
});
