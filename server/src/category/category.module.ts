import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module.js';
import { CategoryService } from './category.service.js';
import { CategoryController } from './category.controller.js';
import { Category } from './entities/category.entity.js';
import { categoryProviders } from './category.provider.js';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [...categoryProviders, CategoryService],
  exports: [CategoryService, ...categoryProviders],
})
export class CategoryModule {}