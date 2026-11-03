import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AssetMediaController } from './asset-media.controller.js';
import { AssetMediaService } from './asset-media.service.js';
import { MediaType } from './entities/asset-media.entity.js';
import { UserRole } from '../user/entities/user.entity.js';

describe('AssetMediaController', () => {
  let controller: AssetMediaController;
  let mockAssetMediaService: any;

  const mockUserReq = {
    user: {
      user_id: 2,
      username: 'creator_test',
      role: UserRole.CREATOR,
    },
  };

  beforeEach(async () => {
    mockAssetMediaService = {
      findByAssetId: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      reorder: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetMediaController],
      providers: [
        {
          provide: AssetMediaService,
          useValue: mockAssetMediaService,
        },
      ],
    }).compile();

    controller = module.get<AssetMediaController>(AssetMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findByAssetId', () => {
    it('should return media array for an asset', async () => {
      const expected = [
        {
          media_id: 1,
          asset_id: 10,
          media_url: 'https://example.com/demo.png',
          media_type: MediaType.IMAGE,
          display_order: 0,
        },
      ];
      mockAssetMediaService.findByAssetId.mockResolvedValue(expected);

      const result = await controller.findByAssetId(10);
      expect(mockAssetMediaService.findByAssetId).toHaveBeenCalledWith(10);
      expect(result).toEqual(expected);
    });
  });

  describe('findOne', () => {
    it('should return a specific media item', async () => {
      const expected = {
        media_id: 1,
        asset_id: 10,
        media_url: 'https://example.com/demo.png',
        media_type: MediaType.IMAGE,
        display_order: 0,
      };
      mockAssetMediaService.findOne.mockResolvedValue(expected);

      const result = await controller.findOne(1);
      expect(mockAssetMediaService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });

  describe('create', () => {
    it('should call service.create with creator credentials', async () => {
      const dto = {
        asset_id: 10,
        media_url: 'https://example.com/preview.gif',
        media_type: MediaType.GIF,
      };
      const expected = { media_id: 2, ...dto, display_order: 1 };
      mockAssetMediaService.create.mockResolvedValue(expected);

      const result = await controller.create(dto, mockUserReq);
      expect(mockAssetMediaService.create).toHaveBeenCalledWith(
        dto,
        mockUserReq.user.user_id,
        false,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('update', () => {
    it('should update media item successfully', async () => {
      const dto = { media_url: 'https://example.com/updated.png' };
      const expected = { media_id: 1, asset_id: 10, ...dto };
      mockAssetMediaService.update.mockResolvedValue(expected);

      const result = await controller.update(1, dto, mockUserReq);
      expect(mockAssetMediaService.update).toHaveBeenCalledWith(
        1,
        dto,
        mockUserReq.user.user_id,
        false,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should remove media item', async () => {
      const expected = { message: 'Đã xóa file media #1 thành công' };
      mockAssetMediaService.remove.mockResolvedValue(expected);

      const result = await controller.remove(1, mockUserReq);
      expect(mockAssetMediaService.remove).toHaveBeenCalledWith(
        1,
        mockUserReq.user.user_id,
        false,
      );
      expect(result).toEqual(expected);
    });
  });

  describe('reorder', () => {
    it('should reorder media items for an asset', async () => {
      const orderIds = [3, 1, 2];
      const expected = { message: 'Đã cập nhật thứ tự hiển thị 3 media' };
      mockAssetMediaService.reorder.mockResolvedValue(expected);

      const result = await controller.reorder(10, orderIds, mockUserReq);
      expect(mockAssetMediaService.reorder).toHaveBeenCalledWith(
        10,
        orderIds,
        mockUserReq.user.user_id,
        false,
      );
      expect(result).toEqual(expected);
    });
  });
});

