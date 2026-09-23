import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseProviders } from './database.providers.js';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 3306)),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database:
          configService.get('DB_DATABASE') ??
          configService.get('DB_NAME', 'GameAssetDB'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
  ],
  providers: [...databaseProviders],
  exports: [TypeOrmModule, ...databaseProviders],
})
export class DatabaseModule {}
