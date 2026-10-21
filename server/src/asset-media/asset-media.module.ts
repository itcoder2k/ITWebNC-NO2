import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module.js';
import { AssetMedia } from './entities/asset-media.entity.js';
import { Asset } from '../asset/entities/asset.entity.js';
import { AssetMediaController } from './asset-media.controller.js';
import { AssetMediaService } from './asset-media.service.js';
import { assetMediaProviders } from './asset-media.provider.js';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([AssetMedia, Asset])],
  controllers: [AssetMediaController],
  providers: [...assetMediaProviders, AssetMediaService],
  exports: [AssetMediaService, ...assetMediaProviders],
})
export class AssetMediaModule {}
