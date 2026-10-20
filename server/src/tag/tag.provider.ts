import { DataSource } from 'typeorm';
import { Tag } from './entities/tag.entity.js';
import { AssetTag } from './entities/asset-tags.entity.js';

export const tagProviders = [
  {
    provide: 'TAG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Tag),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ASSET_TAG_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(AssetTag),
    inject: ['DATA_SOURCE'],
  },
];
