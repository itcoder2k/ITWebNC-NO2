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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { AssetService } from './asset.service.js';
import { CreateAssetDto } from './dto/create-asset.dto.js';
import { UpdateAssetDto } from './dto/update-asset.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from '../user/entities/user.entity.js';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

const assetUploadDir = resolve(process.cwd(), 'uploads', 'assets');

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CREATOR, UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          if (!existsSync(assetUploadDir)) mkdirSync(assetUploadDir, { recursive: true });
          callback(null, assetUploadDir);
        },
        filename: (_req, file, callback) => {
          callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      limits: { fileSize: 200 * 1024 * 1024 },
      fileFilter: (_req, file, callback) => {
        const allowed = ['.zip', '.rar', '.unitypackage'];
        if (!allowed.includes(extname(file.originalname).toLowerCase())) {
          callback(new BadRequestException('Chỉ hỗ trợ file ZIP, RAR hoặc UnityPackage.'), false);
          return;
        }
        callback(null, true);
      },
    }),
  )
  create(
    @Body() createAssetDto: CreateAssetDto,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Request() req: { user: { user_id: number } },
  ) {
    if (!file && !createAssetDto.file_url?.trim()) {
      throw new BadRequestException('Vui lòng upload file hoặc cung cấp đường dẫn file tài nguyên.');
    }

    if (file) {
      createAssetDto.file_url = `/uploads/assets/${file.filename}`;
      createAssetDto.file_size = file.size;
    }

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

  @UseGuards(JwtAuthGuard)
  @Get(':id/download-file')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { user_id: number } },
    @Res() res: any,
  ) {
    const downloadInfo = await this.assetService.getDownload(
      id,
      req.user.user_id,
    );
    return this.assetService.streamZip(id, downloadInfo, res);
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
