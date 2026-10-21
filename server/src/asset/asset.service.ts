import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto.js';
import { UpdateAssetDto } from './dto/update-asset.dto.js';
import { Asset } from './entities/asset.entity.js';

@Injectable()
export class AssetService {
  constructor(
    @Inject('ASSET_REPOSITORY')
    private readonly assetRepository: Repository<Asset>,
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createAssetDto: CreateAssetDto,
    uploaderId: number,
  ): Promise<Asset> {
    const newAsset = this.assetRepository.create({
      title: createAssetDto.title,
      short_description: createAssetDto.short_description,
      description: createAssetDto.description,
      price: createAssetDto.price,
      thumbnail_url: createAssetDto.thumbnail_url,
      file_url: createAssetDto.file_url,
      file_size: createAssetDto.file_size,
      license: createAssetDto.license,
      category_id: createAssetDto.category_id,
      uploader_id: uploaderId,
    });
    return this.assetRepository.save(newAsset);
  }

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find({
      where: { status: 'active' },
      select: {
        asset_id: true,
        title: true,
        short_description: true,
        description: true,
        price: true,
        thumbnail_url: true,
        file_size: true,
        license: true,
        views_count: true,
        downloads_count: true,
        status: true,
        uploader_id: true,
        category_id: true,
        created_at: true,
        updated_at: true,
      },
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetRepository.findOne({
      where: { asset_id: id, status: 'active' },
      select: {
        asset_id: true,
        title: true,
        short_description: true,
        description: true,
        price: true,
        thumbnail_url: true,
        file_size: true,
        license: true,
        views_count: true,
        downloads_count: true,
        status: true,
        uploader_id: true,
        category_id: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!asset) {
      throw new NotFoundException(`Không tìm thấy tài nguyên với ID: ${id}`);
    }
    await this.assetRepository.increment({ asset_id: id }, 'views_count', 1);
    asset.views_count += 1;
    return asset;
  }

  async update(
    id: number,
    updateAssetDto: UpdateAssetDto,
    actorId: number,
    isAdmin: boolean,
  ): Promise<Asset> {
    const asset = await this.getOwnedAsset(id, actorId, isAdmin);
    this.assetRepository.merge(asset, updateAssetDto);
    return this.assetRepository.save(asset);
  }

  async remove(
    id: number,
    actorId: number,
    isAdmin: boolean,
  ): Promise<{ message: string }> {
    const asset = await this.getOwnedAsset(id, actorId, isAdmin);
    await this.assetRepository.remove(asset);
    return { message: `Đã xóa tài nguyên #${id} thành công` };
  }

  async getDownload(
    id: number,
    userId: number,
  ): Promise<{ asset_id: number; file_url: string; license: string }> {
    const asset = await this.assetRepository.findOneBy({
      asset_id: id,
      status: 'active',
    });
    if (!asset) {
      throw new NotFoundException(`Không tìm thấy tài nguyên với ID: ${id}`);
    }

    const isOwner = asset.uploader_id === userId;
    const isFree = Number(asset.price) === 0;
    const [purchase] = await this.dataSource.query(
      `SELECT od.order_detail_id
       FROM OrderDetails od
       INNER JOIN Orders o ON o.order_id = od.order_id
       WHERE o.user_id = ? AND od.asset_id = ?
         AND o.status IN ('Completed', 'completed')
       LIMIT 1`,
      [userId, id],
    );
    if (!isOwner && !isFree && !purchase) {
      throw new ForbiddenException(
        'Bạn cần mua tài nguyên trước khi tải xuống',
      );
    }

    await this.assetRepository.increment(
      { asset_id: id },
      'downloads_count',
      1,
    );
    return {
      asset_id: asset.asset_id,
      file_url: asset.file_url,
      license: asset.license,
    };
  }

  private async getOwnedAsset(
    id: number,
    actorId: number,
    isAdmin: boolean,
  ): Promise<Asset> {
    const asset = await this.assetRepository.findOneBy({ asset_id: id });
    if (!asset) {
      throw new NotFoundException(`Không tìm thấy tài nguyên với ID: ${id}`);
    }
    if (!isAdmin && asset.uploader_id !== actorId) {
      throw new ForbiddenException(
        'Bạn không có quyền chỉnh sửa tài nguyên này',
      );
    }
    return asset;
  }
}
