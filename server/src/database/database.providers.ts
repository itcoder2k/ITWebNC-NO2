import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { User } from '../user/entities/user.entity.js';
import { Category } from '../category/entities/category.entity.js';
import { Tag } from '../tag/entities/tag.entity.js';
import { AssetTag } from '../tag/entities/asset-tags.entity.js';
import { Asset } from '../asset/entities/asset.entity.js';
import { AssetMedia } from '../asset-media/entities/asset-media.entity.js';
import { Order } from '../order/entities/order.entity.js';
import { OrderDetail } from '../order-detail/order-detail.entity.js';
import { Review } from '../review/entities/review.entity.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || process.env.DB_NAME || 'GameAssetDB',
        entities: [
          User,
          Category,
          Tag,
          AssetTag,
          Asset,
          AssetMedia,
          Order,
          OrderDetail,
          Review,
          join(__dirname, '/../**/*.entity{.ts,.js}'),
        ],
        synchronize: false,
      });

      return dataSource.initialize();
    },
  },
];
