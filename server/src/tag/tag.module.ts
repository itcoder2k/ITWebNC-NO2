import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module.js';
import { Tag } from './entities/tag.entity.js';
import { AssetTag } from './entities/asset-tags.entity.js';
import { AssetMedia } from '../asset-media/entities/asset-media.entity.js';
import { TagController } from './tag.controller.js';
import { TagService } from './tag.service.js';
import { tagProviders } from './tag.provider.js';
import { assetMediaProviders } from '../asset-media/asset-media.provider.js';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Tag, AssetTag, AssetMedia]),
  ],
  controllers: [TagController],
  providers: [
    ...tagProviders,
    ...assetMediaProviders,
    TagService,
  ],
  exports: [TagService, ...tagProviders, ...assetMediaProviders],
})
export class TagModule {}
