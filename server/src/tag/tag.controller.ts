import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TagService } from './tag.service.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { CreateAssetMediaDto } from '../asset-media/dto/create-asset-media.dto.js';
import { UpdateAssetMediaDto } from '../asset-media/dto/update-asset-media.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/entities/user.entity.js';

@Controller(['tags', 'tag'])
export class TagController {
  constructor(private readonly tagService: TagService) {}

  // ==========================================
  // TAG ENDPOINTS (TẦNG TRÌNH DIỄN - THẺ GẮN)
  // ==========================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CREATOR)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get('popular')
  getPopular(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.tagService.getPopular(parsedLimit);
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.tagService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }

  // ==========================================
  // ASSET-TAG ASSOCIATION ENDPOINTS
  // ==========================================

  @Get('asset/:assetId')
  getTagsByAssetId(@Param('assetId', ParseIntPipe) assetId: number) {
    return this.tagService.getTagsByAssetId(assetId);
  }

  @Post('asset/:assetId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  assignTags(
    @Param('assetId', ParseIntPipe) assetId: number,
    @Body('tagIds') tagIds: number[],
  ) {
    return this.tagService.assignTagsToAsset(assetId, tagIds || []);
  }

  // ========================================================
  // DEMO GALLERY (ASSET MEDIA) ENDPOINTS TRÊN TAG CONTROLLER
  // ========================================================

  @Get('media/asset/:assetId')
  getMediaByAssetId(@Param('assetId', ParseIntPipe) assetId: number) {
    return this.tagService.findMediaByAssetId(assetId);
  }

  @Post('media')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  createMedia(@Body() createAssetMediaDto: CreateAssetMediaDto) {
    return this.tagService.createMedia(createAssetMediaDto);
  }

  @Patch('media/:mediaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  updateMedia(
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @Body() updateAssetMediaDto: UpdateAssetMediaDto,
  ) {
    return this.tagService.updateMedia(mediaId, updateAssetMediaDto);
  }

  @Delete('media/:mediaId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  removeMedia(@Param('mediaId', ParseIntPipe) mediaId: number) {
    return this.tagService.removeMedia(mediaId);
  }
}
