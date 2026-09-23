import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAssetDto } from './dto/create-asset.dto.js';
import { UpdateAssetDto } from './dto/update-asset.dto.js';
import { Asset } from './entities/asset.entity.js';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async create(createAssetDto: CreateAssetDto): Promise<Asset> {
    const newAsset = this.assetRepository.create(createAssetDto);
    return this.assetRepository.save(newAsset);
  }

  async findAll(): Promise<Asset[]> {
    return this.assetRepository.find();
  }

  async findOne(id: number): Promise<Asset> {
    const asset = await this.assetRepository.findOneBy({ asset_id: id });
    if (!asset) {
      throw new NotFoundException(`Không tìm thấy tài nguyên với ID: ${id}`);
    }
    return asset;
  }

  async update(id: number, updateAssetDto: UpdateAssetDto): Promise<Asset> {
    const asset = await this.findOne(id);
    this.assetRepository.merge(asset, updateAssetDto);
    return this.assetRepository.save(asset);
  }

  async remove(id: number): Promise<{ message: string }> {
    const asset = await this.findOne(id);
    await this.assetRepository.remove(asset);
    return { message: `Đã xóa tài nguyên #${id} thành công` };
  }
}
