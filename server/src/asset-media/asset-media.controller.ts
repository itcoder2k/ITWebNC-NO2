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
  Request,
  UseGuards,
} from '@nestjs/common';
import { AssetMediaService } from './asset-media.service.js';
import { CreateAssetMediaDto } from './dto/create-asset-media.dto.js';
import { UpdateAssetMediaDto } from './dto/update-asset-media.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/entities/user.entity.js';

interface AuthenticatedRequest {
  user: {
    user_id: number;
    username: string;
    role: UserRole;
  };
}

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
  create(
    @Body() createAssetMediaDto: CreateAssetMediaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.assetMediaService.create(
      createAssetMediaDto,
      req.user.user_id,
      req.user.role === UserRole.ADMIN,
    );
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssetMediaDto: UpdateAssetMediaDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.assetMediaService.update(
      id,
      updateAssetMediaDto,
      req.user.user_id,
      req.user.role === UserRole.ADMIN,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.assetMediaService.remove(
      id,
      req.user.user_id,
      req.user.role === UserRole.ADMIN,
    );
  }

  @Put('reorder/:assetId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  reorder(
    @Param('assetId', ParseIntPipe) assetId: number,
    @Body('mediaOrderIds') mediaOrderIds: number[],
    @Request() req: AuthenticatedRequest,
  ) {
    return this.assetMediaService.reorder(
      assetId,
      mediaOrderIds,
      req.user.user_id,
      req.user.role === UserRole.ADMIN,
    );
  }
}
