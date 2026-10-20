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
  Put,
  UseGuards,
} from '@nestjs/common';
import { AssetMediaService } from './asset-media.service.js';
import { CreateAssetMediaDto } from './dto/create-asset-media.dto.js';
import { UpdateAssetMediaDto } from './dto/update-asset-media.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/entities/user.entity.js';

@Controller(['asset-media', 'asset-medias'])
export class AssetMediaController {
  constructor(private readonly assetMediaService: AssetMediaService) {}

  @Get('asset/:assetId')
  findByAssetId(@Param('assetId', ParseIntPipe) assetId: number) {
    return this.assetMediaService.findByAssetId(assetId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assetMediaService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAssetMediaDto: CreateAssetMediaDto) {
    return this.assetMediaService.create(createAssetMediaDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssetMediaDto: UpdateAssetMediaDto,
  ) {
    return this.assetMediaService.update(id, updateAssetMediaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assetMediaService.remove(id);
  }

  @Put('reorder/:assetId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  reorder(
    @Param('assetId', ParseIntPipe) assetId: number,
    @Body('mediaOrderIds') mediaOrderIds: number[],
  ) {
    return this.assetMediaService.reorder(assetId, mediaOrderIds);
  }
}
