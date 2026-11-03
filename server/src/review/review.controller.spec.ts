import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewController } from './review.controller.js';
import { ReviewService } from './review.service.js';
import { UserRole } from '../user/entities/user.entity.js';

describe('ReviewController', () => {
  let controller: ReviewController;
  let mockReviewService: any;

  beforeEach(async () => {
    mockReviewService = {
      create: vi.fn(),
      findForAsset: vi.fn(),
      remove: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: mockReviewService,
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a review for an asset', async () => {
      const req = { user: { user_id: 5 } };
      const dto = { asset_id: 1, rating: 5, comment: 'Tài nguyên tuyệt vời!' };
      const expected = { review_id: 1, user_id: 5, ...dto };
      mockReviewService.create.mockResolvedValue(expected);

      const result = await controller.create(req, dto);
      expect(mockReviewService.create).toHaveBeenCalledWith(5, dto);
      expect(result).toEqual(expected);
    });
  });

  describe('findForAsset', () => {
    it('should return all reviews for an asset', async () => {
      const expected = [
        {
          review_id: 1,
          user_id: 5,
          asset_id: 1,
          rating: 5,
          comment: 'Tuyệt vời!',
          username: 'buyer_hung',
        },
      ];
      mockReviewService.findForAsset.mockResolvedValue(expected);

      const result = await controller.findForAsset(1);
      expect(mockReviewService.findForAsset).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });
  });

  describe('remove', () => {
    it('should delete a review', async () => {
      const req = { user: { user_id: 5, role: UserRole.CUSTOMER } };
      const expected = { message: 'Đã xóa đánh giá #1' };
      mockReviewService.remove.mockResolvedValue(expected);

      const result = await controller.remove(1, req);
      expect(mockReviewService.remove).toHaveBeenCalledWith(1, 5, UserRole.CUSTOMER);
      expect(result).toEqual(expected);
    });
  });
});

