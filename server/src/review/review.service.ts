import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRole } from '../user/entities/user.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { Review } from './entities/review.entity.js';

@Injectable()
export class ReviewService {
  constructor(
    @Inject('REVIEW_REPOSITORY')
    private readonly reviewRepository: Repository<Review>,
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: number,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const [asset] = await this.dataSource.query(
      'SELECT asset_id FROM Assets WHERE asset_id = ?',
      [createReviewDto.asset_id],
    );
    if (!asset) {
      throw new NotFoundException('Không tìm thấy tài nguyên cần đánh giá');
    }

    const [purchase] = await this.dataSource.query(
      `SELECT od.order_detail_id
       FROM OrderDetails od
       INNER JOIN Orders o ON o.order_id = od.order_id
       WHERE o.user_id = ? AND od.asset_id = ?
         AND o.status IN ('Completed', 'completed')
       LIMIT 1`,
      [userId, createReviewDto.asset_id],
    );
    if (!purchase) {
      throw new ForbiddenException(
        'Chỉ người đã mua mới có thể đánh giá tài nguyên',
      );
    }

    const existing = await this.reviewRepository.findOneBy({
      user_id: userId,
      asset_id: createReviewDto.asset_id,
    });
    if (existing) {
      throw new ConflictException('Bạn đã đánh giá tài nguyên này');
    }

    const review = this.reviewRepository.create({
      user_id: userId,
      asset_id: createReviewDto.asset_id,
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
    });
    return this.reviewRepository.save(review);
  }

  async findForAsset(assetId: number): Promise<Review[]> {
    const [asset] = await this.dataSource.query(
      'SELECT asset_id FROM Assets WHERE asset_id = ?',
      [assetId],
    );
    if (!asset) {
      throw new NotFoundException('Không tìm thấy tài nguyên');
    }
    return this.reviewRepository.find({
      where: { asset_id: assetId },
      order: { created_at: 'DESC' },
    });
  }

  async remove(
    id: number,
    actorId: number,
    role: UserRole,
  ): Promise<{ message: string }> {
    const review = await this.reviewRepository.findOneBy({ review_id: id });
    if (!review) {
      throw new NotFoundException(`Không tìm thấy đánh giá với ID ${id}`);
    }
    if (role !== UserRole.ADMIN && review.user_id !== actorId) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }
    await this.reviewRepository.remove(review);
    return { message: `Đã xóa đánh giá #${id}` };
  }
}
