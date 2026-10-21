import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { orderProviders } from './order.provider.js';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [OrderController],
  providers: [...orderProviders, OrderService],
  exports: [OrderService, ...orderProviders],
})
export class OrderModule {}
