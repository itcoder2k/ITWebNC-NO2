import { Test, TestingModule } from '@nestjs/testing';
import { AssetMediaService } from './asset-media.service.js';
import { MediaType } from './entities/asset-media.entity.js';
import { NotFoundException } from '@nestjs/common';

describe('AssetMediaService', () => {
  let service: AssetMediaService;
  let mockMediaRepo: any;

  beforeEach(async () => {
    mockMediaRepo = {
      create: vi.fn((dto) => ({ ...dto })),
      save: vi.fn((entity) => Promise.resolve({ media_id: 1, ...entity })),
      find: vi.fn(),
      findOne: vi.fn(),
      count: vi.fn(() => Promise.resolve(0)),
      remove: vi.fn((entity) => Promise.resolve(entity)),
      update: vi.fn(() => Promise.resolve({ affected: 1 })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetMediaService,
        { provide: 'ASSET_MEDIA_REPOSITORY', useValue: mockMediaRepo },
      ],
    }).compile();

    service = module.get<AssetMediaService>(AssetMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByAssetId', () => {
    it('should return media list for asset', async () => {
      const mediaList = [
        {
          media_id: 1,
          asset_id: 1,
          media_url: 'https://example.com/pic.jpg',
          media_type: MediaType.IMAGE,
          display_order: 1,
        },
      ];
      mockMediaRepo.find.mockResolvedValue(mediaList);

      const result = await service.findByAssetId(1);
      expect(result).toEqual(mediaList);
    });
  });

  describe('create', () => {
    it('should create media item with computed display_order', async () => {
      mockMediaRepo.count.mockResolvedValue(1);

      const dto = {
        asset_id: 1,
        media_url: 'https://example.com/preview.mp4',
        media_type: MediaType.VIDEO,
      };

      const result = await service.create(dto);
      expect(mockMediaRepo.create).toHaveBeenCalledWith({
        ...dto,
        display_order: 2,
      });
      expect(result).toHaveProperty('media_id', 1);
    });
  });

  describe('findOne and remove', () => {
    it('should throw NotFoundException if media not found', async () => {
      mockMediaRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should remove media successfully', async () => {
      const media = { media_id: 2, asset_id: 1 };
      mockMediaRepo.findOne.mockResolvedValue(media);

      const result = await service.remove(2);
      expect(mockMediaRepo.remove).toHaveBeenCalledWith(media);
      expect(result.message).toContain('Đã xóa demo media #2');
    });
  });
});
