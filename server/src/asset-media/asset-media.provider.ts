import { DataSource } from 'typeorm';
import { AssetMedia } from './entities/asset-media.entity.js';

export const assetMediaProviders = [
  {
    provide: 'ASSET_MEDIA_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AssetMedia),
    inject: ['DATA_SOURCE'],
  },
];
