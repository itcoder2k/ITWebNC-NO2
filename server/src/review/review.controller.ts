import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { UserRole } from '../user/entities/user.entity.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { ReviewService } from './review.service.js';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req: { user: { user_id: number } },
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(req.user.user_id, createReviewDto);
  }

  @Get('asset/:assetId')
  findForAsset(@Param('assetId', ParseIntPipe) assetId: number) {
    return this.reviewService.findForAsset(assetId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { user_id: number; role: UserRole } },
  ) {
    return this.reviewService.remove(id, req.user.user_id, req.user.role);
  }
}
