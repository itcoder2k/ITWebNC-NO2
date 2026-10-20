import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller.js';
import { TagService } from './tag.service.js';
import { MediaType } from '../asset-media/entities/asset-media.entity.js';

describe('TagController', () => {
  let controller: TagController;
  let mockTagService: any;

  beforeEach(async () => {
    mockTagService = {
      create: vi.fn(),
      findAll: vi.fn(),
      getPopular: vi.fn(),
      findBySlug: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      getTagsByAssetId: vi.fn(),
      assignTagsToAsset: vi.fn(),
      findMediaByAssetId: vi.fn(),
      createMedia: vi.fn(),
      updateMedia: vi.fn(),
      removeMedia: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: mockTagService,
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const dto = { name: 'Pixel Art' };
      const expected = { tag_id: 1, name: 'Pixel Art', slug: 'pixel-art' };
      mockTagService.create.mockResolvedValue(expected);

      const result = await controller.create(dto);
      expect(mockTagService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findAll', () => {
    it('should return all tags', async () => {
      const expected = [{ tag_id: 1, name: 'Pixel Art', slug: 'pixel-art' }];
      mockTagService.findAll.mockResolvedValue(expected);

      const result = await controller.findAll();
      expect(mockTagService.findAll).toHaveBeenCalled();
      expect(result).toEqual(expected);
    });
  });

  describe('getPopular', () => {
    it('should return popular tags with limit', async () => {
      const expected = [
        { tag_id: 1, name: 'Pixel Art', slug: 'pixel-art', asset_count: 5 },
      ];
      mockTagService.getPopular.mockResolvedValue(expected);

      const result = await controller.getPopular('5');
      expect(mockTagService.getPopular).toHaveBeenCalledWith(5);
      expect(result).toEqual(expected);
    });
  });

  describe('findBySlug', () => {
    it('should find tag by slug', async () => {
      const expected = { tag_id: 1, name: 'Pixel Art', slug: 'pixel-art' };
      mockTagService.findBySlug.mockResolvedValue(expected);

      const result = await controller.findBySlug('pixel-art');
      expect(mockTagService.findBySlug).toHaveBeenCalledWith('pixel-art');
      expect(result).toEqual(expected);
    });
  });

  describe('demo gallery routes on TagController', () => {
    it('should get media by assetId', async () => {
      const media = [
        {
          media_id: 1,
          asset_id: 2,
          media_url: 'https://example.com/demo.png',
          media_type: MediaType.IMAGE,
          display_order: 1,
        },
      ];
      mockTagService.findMediaByAssetId.mockResolvedValue(media);

      const result = await controller.getMediaByAssetId(2);
      expect(mockTagService.findMediaByAssetId).toHaveBeenCalledWith(2);
      expect(result).toEqual(media);
    });

    it('should create media preview for asset', async () => {
      const dto = {
        asset_id: 2,
        media_url: 'https://example.com/demo.gif',
        media_type: MediaType.GIF,
      };
      const created = { media_id: 2, ...dto, display_order: 1 };
      mockTagService.createMedia.mockResolvedValue(created);

      const result = await controller.createMedia(dto);
      expect(mockTagService.createMedia).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });
});
