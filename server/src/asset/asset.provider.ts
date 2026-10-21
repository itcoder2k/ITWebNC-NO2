import { DataSource } from 'typeorm';
import { Asset } from './entities/asset.entity.js';

export const assetProviders = [
  {
    provide: 'ASSET_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Asset),
    inject: ['DATA_SOURCE'],
  },
];
