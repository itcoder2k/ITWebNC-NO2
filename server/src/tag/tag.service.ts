import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity.js';
import { AssetTag } from './entities/asset-tags.entity.js';
import { AssetMedia } from '../asset-media/entities/asset-media.entity.js';
import { CreateTagDto } from './dto/create-tag.dto.js';
import { UpdateTagDto } from './dto/update-tag.dto.js';
import { CreateAssetMediaDto } from '../asset-media/dto/create-asset-media.dto.js';
import { UpdateAssetMediaDto } from '../asset-media/dto/update-asset-media.dto.js';

export function slugify(text: string): string {
  return text
    .toString()
    .replace(/[đĐ]/g, 'd')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

@Injectable()
export class TagService {
  private readonly tagRepository: Repository<Tag>;
  private readonly assetTagRepository?: Repository<AssetTag>;
  private readonly assetMediaRepository?: Repository<AssetMedia>;

  constructor(
    @Optional()
    @InjectRepository(Tag)
    typeormTagRepo?: Repository<Tag>,
    @Optional()
    @Inject('TAG_REPOSITORY')
    customTagRepo?: Repository<Tag>,
    @Optional()
    @InjectRepository(AssetTag)
    typeormAssetTagRepo?: Repository<AssetTag>,
    @Optional()
    @Inject('ASSET_TAG_REPOSITORY')
    customAssetTagRepo?: Repository<AssetTag>,
    @Optional()
    @InjectRepository(AssetMedia)
    typeormMediaRepo?: Repository<AssetMedia>,
    @Optional()
    @Inject('ASSET_MEDIA_REPOSITORY')
    customMediaRepo?: Repository<AssetMedia>,
  ) {
    this.tagRepository = (typeormTagRepo ?? customTagRepo)!;
    this.assetTagRepository = typeormAssetTagRepo ?? customAssetTagRepo;
    this.assetMediaRepository = typeormMediaRepo ?? customMediaRepo;
  }

  // ==========================================
  // TAG BUSINESS LOGIC (TẦNG NGHIỆP VỤ THẺ GẮN)
  // ==========================================

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const name = createTagDto.name.trim();
    const slug = (createTagDto.slug?.trim() || slugify(name)).toLowerCase();

    if (!slug) {
      throw new BadRequestException('Không thể tạo slug hợp lệ từ tên thẻ');
    }

    const existingTag = await this.tagRepository.findOne({
      where: [{ name }, { slug }],
    });

    if (existingTag) {
      if (existingTag.name.toLowerCase() === name.toLowerCase()) {
        throw new ConflictException(`Thẻ '${name}' đã tồn tại`);
      }
      if (existingTag.slug === slug) {
        throw new ConflictException(`Slug '${slug}' đã được sử dụng`);
      }
    }

    const newTag = this.tagRepository.create({
      name,
      slug,
    });

    return await this.tagRepository.save(newTag);
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { tag_id: id },
    });

    if (!tag) {
      throw new NotFoundException(`Không tìm thấy thẻ với ID: ${id}`);
    }

    return tag;
  }

  async findBySlug(slug: string): Promise<Tag> {
    const formattedSlug = slug.trim().toLowerCase();
    const tag = await this.tagRepository.findOne({
      where: { slug: formattedSlug },
    });

    if (!tag) {
      throw new NotFoundException(`Không tìm thấy thẻ với slug: '${slug}'`);
    }

    return tag;
  }

  async getPopular(limit = 10): Promise<{ tag_id: number; name: string; slug: string; asset_count: number }[]> {
    const safeLimit = Math.max(1, Math.min(limit, 50));

    try {
      const results = await this.tagRepository
        .createQueryBuilder('tag')
        .leftJoin(AssetTag, 'at', 'at.tag_id = tag.tag_id')
        .select('tag.tag_id', 'tag_id')
        .addSelect('tag.name', 'name')
        .addSelect('tag.slug', 'slug')
        .addSelect('COUNT(at.asset_id)', 'asset_count')
        .groupBy('tag.tag_id')
        .orderBy('COUNT(at.asset_id)', 'DESC')
        .addOrderBy('tag.name', 'ASC')
        .limit(safeLimit)
        .getRawMany();

      return results.map((row) => ({
        tag_id: Number(row.tag_id),
        name: row.name,
        slug: row.slug,
        asset_count: Number(row.asset_count || 0),
      }));
    } catch {
      // Fallback nếu chưa có bảng quan hệ trong memory DB
      const tags = await this.tagRepository.find({ take: safeLimit });
      return tags.map((t) => ({
        tag_id: t.tag_id,
        name: t.name,
        slug: t.slug,
        asset_count: 0,
      }));
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    if (updateTagDto.name !== undefined) {
      tag.name = updateTagDto.name.trim();
    }

    if (updateTagDto.slug !== undefined) {
      tag.slug = updateTagDto.slug.trim().toLowerCase();
    } else if (updateTagDto.name !== undefined) {
      tag.slug = slugify(tag.name);
    }

    const conflict = await this.tagRepository.findOne({
      where: [{ name: tag.name }, { slug: tag.slug }],
    });

    if (conflict && conflict.tag_id !== id) {
      throw new ConflictException(
        `Tên thẻ '${tag.name}' hoặc slug '${tag.slug}' đã thuộc về thẻ khác`,
      );
    }

    return await this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<{ message: string }> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
    return { message: `Đã xóa thẻ #${id} ('${tag.name}') thành công` };
  }

  // ==========================================
  // ASSET-TAG ASSOCIATION LOGIC (GẮN THẺ TÀI NGUYÊN)
  // ==========================================

  async getTagsByAssetId(assetId: number): Promise<Tag[]> {
    return await this.tagRepository
      .createQueryBuilder('tag')
      .innerJoin(AssetTag, 'at', 'at.tag_id = tag.tag_id')
      .where('at.asset_id = :assetId', { assetId })
      .orderBy('tag.name', 'ASC')
      .getMany();
  }

  async assignTagsToAsset(
    assetId: number,
    tagIds: number[],
  ): Promise<{ message: string; count: number }> {
    if (!this.assetTagRepository) {
      throw new BadRequestException('ASSET_TAG_REPOSITORY chưa được cấu hình');
    }

    // Xóa các liên kết cũ của asset
    await this.assetTagRepository.delete({ asset_id: assetId });

    if (!tagIds || tagIds.length === 0) {
      return { message: `Đã xóa toàn bộ thẻ của tài nguyên #${assetId}`, count: 0 };
    }

    const uniqueTagIds = Array.from(new Set(tagIds));
    const entities = uniqueTagIds.map((tag_id) =>
      this.assetTagRepository!.create({ asset_id: assetId, tag_id }),
    );

    await this.assetTagRepository.save(entities);
    return {
      message: `Đã gắn ${uniqueTagIds.length} thẻ cho tài nguyên #${assetId}`,
      count: uniqueTagIds.length,
    };
  }

  // ========================================================
  // ASSET MEDIA (DEMO GALLERY) LOGIC (THƯ VIỆN ĐA PHƯƠNG TIỆN)
  // ========================================================

  async findMediaByAssetId(assetId: number): Promise<AssetMedia[]> {
    if (!this.assetMediaRepository) {
      throw new BadRequestException('ASSET_MEDIA_REPOSITORY chưa được cấu hình');
    }

    return await this.assetMediaRepository.find({
      where: { asset_id: assetId },
      order: {
        display_order: 'ASC',
        created_at: 'ASC',
      },
    });
  }

  async findMediaById(mediaId: number): Promise<AssetMedia> {
    if (!this.assetMediaRepository) {
      throw new BadRequestException('ASSET_MEDIA_REPOSITORY chưa được cấu hình');
    }

    const media = await this.assetMediaRepository.findOne({
      where: { media_id: mediaId },
    });

    if (!media) {
      throw new NotFoundException(`Không tìm thấy demo media với ID: ${mediaId}`);
    }

    return media;
  }

  async createMedia(createAssetMediaDto: CreateAssetMediaDto): Promise<AssetMedia> {
    if (!this.assetMediaRepository) {
      throw new BadRequestException('ASSET_MEDIA_REPOSITORY chưa được cấu hình');
    }

    let displayOrder = createAssetMediaDto.display_order;

    if (displayOrder === undefined) {
      // Tự động gán display_order kế tiếp
      const count = await this.assetMediaRepository.count({
        where: { asset_id: createAssetMediaDto.asset_id },
      });
      displayOrder = count + 1;
    }

    const newMedia = this.assetMediaRepository.create({
      ...createAssetMediaDto,
      display_order: displayOrder,
    });

    return await this.assetMediaRepository.save(newMedia);
  }

  async updateMedia(
    mediaId: number,
    updateAssetMediaDto: UpdateAssetMediaDto,
  ): Promise<AssetMedia> {
    if (!this.assetMediaRepository) {
      throw new BadRequestException('ASSET_MEDIA_REPOSITORY chưa được cấu hình');
    }

    const media = await this.findMediaById(mediaId);
    Object.assign(media, updateAssetMediaDto);

    return await this.assetMediaRepository.save(media);
  }

  async removeMedia(mediaId: number): Promise<{ message: string }> {
    if (!this.assetMediaRepository) {
      throw new BadRequestException('ASSET_MEDIA_REPOSITORY chưa được cấu hình');
    }

    const media = await this.findMediaById(mediaId);
    await this.assetMediaRepository.remove(media);
    return { message: `Đã xóa demo media #${mediaId} thành công` };
  }

  async reorderMedia(
    assetId: number,
    mediaIdsInOrder: number[],
  ): Promise<AssetMedia[]> {
    if (!this.assetMediaRepository) {
      throw new BadRequestException('ASSET_MEDIA_REPOSITORY chưa được cấu hình');
    }

    for (let index = 0; index < mediaIdsInOrder.length; index++) {
      const mediaId = mediaIdsInOrder[index];
      await this.assetMediaRepository.update(
        { media_id: mediaId, asset_id: assetId },
        { display_order: index + 1 },
      );
    }

    return await this.findMediaByAssetId(assetId);
  }
}
