import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ReviewService } from './review.service.js';
import { UserRole } from '../user/entities/user.entity.js';

describe('ReviewService', () => {
  let service: ReviewService;
  let reviewRepository: any;
  let dataSource: any;

  beforeEach(async () => {
    reviewRepository = {
      create: vi.fn((dto) => ({ ...dto })),
      save: vi.fn((review) => Promise.resolve({ review_id: 1, ...review })),
      find: vi.fn(),
      findOneBy: vi.fn(),
      remove: vi.fn(),
    };
    dataSource = { query: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: 'REVIEW_REPOSITORY', useValue: reviewRepository },
        { provide: 'DATA_SOURCE', useValue: dataSource },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should reject a review when the asset does not exist', async () => {
    dataSource.query.mockResolvedValueOnce([]);

    await expect(service.create(1, { asset_id: 99, rating: 5 })).rejects.toThrow(NotFoundException);
  });

  it('should reject a review when the buyer has not purchased the asset', async () => {
    dataSource.query
      .mockResolvedValueOnce([{ asset_id: 1 }])
      .mockResolvedValueOnce([]);

    await expect(service.create(1, { asset_id: 1, rating: 5 })).rejects.toThrow(ForbiddenException);
  });

  it('should reject a duplicate review', async () => {
    dataSource.query
      .mockResolvedValueOnce([{ asset_id: 1 }])
      .mockResolvedValueOnce([{ order_detail_id: 10 }]);
    reviewRepository.findOneBy.mockResolvedValue({ review_id: 1, user_id: 1, asset_id: 1 });

    await expect(service.create(1, { asset_id: 1, rating: 5 })).rejects.toThrow(ConflictException);
  });

  it('should return reviews with user information for an asset', async () => {
    const mockReviews = [
      {
        review_id: 1,
        user_id: 5,
        asset_id: 1,
        rating: 5,
        comment: 'Tuyệt đẹp!',
        created_at: new Date(),
        username: 'gamer_john',
        display_name: 'John Developer',
        avatar_url: 'https://example.com/avatar.png',
      },
    ];
    dataSource.query
      .mockResolvedValueOnce([{ asset_id: 1 }])
      .mockResolvedValueOnce(mockReviews);

    const result = await service.findForAsset(1);
    expect(result).toEqual(mockReviews);
    expect(result[0].username).toBe('gamer_john');
  });

  it('should throw NotFoundException when finding reviews for non-existent asset', async () => {
    dataSource.query.mockResolvedValueOnce([]);

    await expect(service.findForAsset(999)).rejects.toThrow(NotFoundException);
  });

  it('should allow the review owner to remove their review', async () => {
    reviewRepository.findOneBy.mockResolvedValue({ review_id: 1, user_id: 1, asset_id: 1 });

    const result = await service.remove(1, 1, UserRole.CUSTOMER);

    expect(reviewRepository.remove).toHaveBeenCalled();
    expect(result.message).toContain('Đã xóa');
  });

  it('should reject another user removing the review', async () => {
    reviewRepository.findOneBy.mockResolvedValue({ review_id: 1, user_id: 1, asset_id: 1 });

    await expect(service.remove(1, 2, UserRole.CUSTOMER)).rejects.toThrow(ForbiddenException);
  });
});
