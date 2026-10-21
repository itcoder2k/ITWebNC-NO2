import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { reviewProviders } from './review.provider.js';
import { ReviewController } from './review.controller.js';
import { ReviewService } from './review.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [ReviewController],
  providers: [...reviewProviders, ReviewService],
  exports: [ReviewService, ...reviewProviders],
})
export class ReviewModule {}
