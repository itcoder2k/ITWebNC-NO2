import {
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetMedia } from './entities/asset-media.entity.js';
import { CreateAssetMediaDto } from './dto/create-asset-media.dto.js';
import { UpdateAssetMediaDto } from './dto/update-asset-media.dto.js';

@Injectable()
export class AssetMediaService {
  private readonly mediaRepository: Repository<AssetMedia>;

  constructor(
    @Optional()
    @InjectRepository(AssetMedia)
    typeormMediaRepo?: Repository<AssetMedia>,
    @Optional()
    @Inject('ASSET_MEDIA_REPOSITORY')
    customMediaRepo?: Repository<AssetMedia>,
  ) {
    this.mediaRepository = (typeormMediaRepo ?? customMediaRepo)!;
  }

  async findByAssetId(assetId: number): Promise<AssetMedia[]> {
    return await this.mediaRepository.find({
      where: { asset_id: assetId },
      order: {
        display_order: 'ASC',
        created_at: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<AssetMedia> {
    const media = await this.mediaRepository.findOne({
      where: { media_id: id },
    });

    if (!media) {
      throw new NotFoundException(`Không tìm thấy demo media với ID: ${id}`);
    }

    return media;
  }

  async create(createAssetMediaDto: CreateAssetMediaDto): Promise<AssetMedia> {
    let displayOrder = createAssetMediaDto.display_order;

    if (displayOrder === undefined) {
      const count = await this.mediaRepository.count({
        where: { asset_id: createAssetMediaDto.asset_id },
      });
      displayOrder = count + 1;
    }

    const newMedia = this.mediaRepository.create({
      ...createAssetMediaDto,
      display_order: displayOrder,
    });

    return await this.mediaRepository.save(newMedia);
  }

  async update(
    id: number,
    updateAssetMediaDto: UpdateAssetMediaDto,
  ): Promise<AssetMedia> {
    const media = await this.findOne(id);
    Object.assign(media, updateAssetMediaDto);
    return await this.mediaRepository.save(media);
  }

  async remove(id: number): Promise<{ message: string }> {
    const media = await this.findOne(id);
    await this.mediaRepository.remove(media);
    return { message: `Đã xóa demo media #${id} thành công` };
  }

  async reorder(assetId: number, mediaOrderIds: number[]): Promise<AssetMedia[]> {
    for (let i = 0; i < mediaOrderIds.length; i++) {
      const mediaId = mediaOrderIds[i];
      await this.mediaRepository.update(
        { media_id: mediaId, asset_id: assetId },
        { display_order: i + 1 },
      );
    }
    return await this.findByAssetId(assetId);
  }
}
