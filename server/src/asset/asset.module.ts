import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { AssetController } from './asset.controller.js';
import { AssetService } from './asset.service.js';
import { assetProviders } from './asset.provider.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AssetController],
  providers: [...assetProviders, AssetService],
  exports: [AssetService],
})
export class AssetModule {}
