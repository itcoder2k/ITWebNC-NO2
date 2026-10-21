import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.providers.js';
import { User } from '../user/entities/user.entity.js';
import { Category } from '../category/entities/category.entity.js';
import { Tag } from '../tag/entities/tag.entity.js';
import { AssetTag } from '../tag/entities/asset-tags.entity.js';
import { Asset } from '../asset/entities/asset.entity.js';
import { AssetMedia } from '../asset-media/entities/asset-media.entity.js';
import { Order } from '../order/entities/order.entity.js';
import { OrderDetail } from '../order-detail/order-detail.entity.js';
import { Review } from '../review/entities/review.entity.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get<number>('DB_PORT', 3306)),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database:
          configService.get<string>('DB_DATABASE') ??
          configService.get<string>('DB_NAME', 'GameAssetDB'),
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
        ],
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
  providers: [...databaseProviders],
  exports: [TypeOrmModule, ...databaseProviders],
})
export class DatabaseModule {}
