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

    service = module.get(ReviewService);
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
