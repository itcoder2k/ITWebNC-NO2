import { Test, TestingModule } from '@nestjs/testing';
import { TagService, slugify } from './tag.service.js';
import { MediaType } from '../asset-media/entities/asset-media.entity.js';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('TagService', () => {
  let service: TagService;
  let mockTagRepo: any;
  let mockAssetTagRepo: any;
  let mockMediaRepo: any;

  beforeEach(async () => {
    mockTagRepo = {
      create: vi.fn((dto) => ({ ...dto })),
      save: vi.fn((entity) => Promise.resolve({ tag_id: 1, ...entity })),
      find: vi.fn(),
      findOne: vi.fn(),
      remove: vi.fn((entity) => Promise.resolve(entity)),
      createQueryBuilder: vi.fn(),
    };

    mockAssetTagRepo = {
      create: vi.fn((dto) => ({ ...dto })),
      save: vi.fn((entities) => Promise.resolve(entities)),
      delete: vi.fn(() => Promise.resolve({ affected: 1 })),
    };

    mockMediaRepo = {
      create: vi.fn((dto) => ({ ...dto })),
      save: vi.fn((entity) => Promise.resolve({ media_id: 1, ...entity })),
      find: vi.fn(),
      findOne: vi.fn(),
      count: vi.fn(() => Promise.resolve(2)),
      remove: vi.fn((entity) => Promise.resolve(entity)),
      update: vi.fn(() => Promise.resolve({ affected: 1 })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: 'TAG_REPOSITORY', useValue: mockTagRepo },
        { provide: 'ASSET_TAG_REPOSITORY', useValue: mockAssetTagRepo },
        { provide: 'ASSET_MEDIA_REPOSITORY', useValue: mockMediaRepo },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('slugify helper', () => {
    it('should convert Vietnamese text with accents to slug', () => {
      expect(slugify('Đồ Họa Pixel')).toBe('do-hoa-pixel');
      expect(slugify('Ánh Sáng & Hiệu Ứng')).toBe('anh-sang-hieu-ung');
    });
  });

  describe('create tag', () => {
    it('should create a tag with auto-generated slug', async () => {
      mockTagRepo.findOne.mockResolvedValue(null);

      const result = await service.create({ name: 'Pixel Art' });
      expect(mockTagRepo.create).toHaveBeenCalledWith({
        name: 'Pixel Art',
        slug: 'pixel-art',
      });
      expect(result).toHaveProperty('tag_id', 1);
    });

    it('should throw ConflictException if tag already exists', async () => {
      mockTagRepo.findOne.mockResolvedValue({
        tag_id: 1,
        name: 'Pixel Art',
        slug: 'pixel-art',
      });

      await expect(service.create({ name: 'Pixel Art' })).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll tags', () => {
    it('should return all tags sorted by name', async () => {
      const tags = [
        { tag_id: 1, name: 'Animated', slug: 'animated' },
        { tag_id: 2, name: 'Pixel Art', slug: 'pixel-art' },
      ];
      mockTagRepo.find.mockResolvedValue(tags);

      const result = await service.findAll();
      expect(result).toEqual(tags);
    });
  });

  describe('findOne tag', () => {
    it('should return tag by ID', async () => {
      const tag = { tag_id: 1, name: 'Pixel Art', slug: 'pixel-art' };
      mockTagRepo.findOne.mockResolvedValue(tag);

      const result = await service.findOne(1);
      expect(result).toEqual(tag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      mockTagRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return tag by slug', async () => {
      const tag = { tag_id: 1, name: 'Pixel Art', slug: 'pixel-art' };
      mockTagRepo.findOne.mockResolvedValue(tag);

      const result = await service.findBySlug('pixel-art');
      expect(result).toEqual(tag);
    });
  });

  describe('remove tag', () => {
    it('should remove tag successfully', async () => {
      const tag = { tag_id: 1, name: 'Pixel Art', slug: 'pixel-art' };
      mockTagRepo.findOne.mockResolvedValue(tag);

      const result = await service.remove(1);
      expect(mockTagRepo.remove).toHaveBeenCalledWith(tag);
      expect(result.message).toContain('Đã xóa thẻ #1');
    });
  });

  describe('AssetMedia demo gallery', () => {
    it('should find media by assetId', async () => {
      const mediaList = [
        {
          media_id: 1,
          asset_id: 10,
          media_url: 'https://example.com/demo.png',
          media_type: MediaType.IMAGE,
          display_order: 1,
        },
      ];
      mockMediaRepo.find.mockResolvedValue(mediaList);

      const result = await service.findMediaByAssetId(10);
      expect(result).toEqual(mediaList);
    });

    it('should create media and auto-assign display_order', async () => {
      mockMediaRepo.count.mockResolvedValue(3);

      const dto = {
        asset_id: 10,
        media_url: 'https://example.com/demo.gif',
        media_type: MediaType.GIF,
      };

      const result = await service.createMedia(dto);
      expect(mockMediaRepo.create).toHaveBeenCalledWith({
        ...dto,
        display_order: 4,
      });
      expect(result).toHaveProperty('media_id', 1);
    });

    it('should delete media by ID', async () => {
      const media = { media_id: 5, asset_id: 10 };
      mockMediaRepo.findOne.mockResolvedValue(media);

      const result = await service.removeMedia(5);
      expect(mockMediaRepo.remove).toHaveBeenCalledWith(media);
      expect(result.message).toContain('Đã xóa demo media #5');
    });
  });
});
