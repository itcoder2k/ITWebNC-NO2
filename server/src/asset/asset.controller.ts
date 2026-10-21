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
  Request,
  UseGuards,
} from '@nestjs/common';
import { AssetService } from './asset.service.js';
import { CreateAssetDto } from './dto/create-asset.dto.js';
import { UpdateAssetDto } from './dto/update-asset.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/entities/user.entity.js';

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  create(
    @Body() createAssetDto: CreateAssetDto,
    @Request() req: { user: { user_id: number } },
  ) {
    return this.assetService.create(createAssetDto, req.user.user_id);
  }

  @Get()
  findAll() {
    return this.assetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assetService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/download')
  download(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { user_id: number } },
  ) {
    return this.assetService.getDownload(id, req.user.user_id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAssetDto: UpdateAssetDto,
    @Request() req: { user: { user_id: number; role: UserRole } },
  ) {
    return this.assetService.update(
      id,
      updateAssetDto,
      req.user.user_id,
      req.user.role === UserRole.ADMIN,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { user_id: number; role: UserRole } },
  ) {
    return this.assetService.remove(
      id,
      req.user.user_id,
      req.user.role === UserRole.ADMIN,
    );
  }
}
