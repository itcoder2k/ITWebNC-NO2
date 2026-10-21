import { DataSource } from 'typeorm';
import { OrderDetail } from '../order-detail/order-detail.entity.js';
import { Order } from './entities/order.entity.js';

export const orderProviders = [
  {
    provide: 'ORDER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ORDER_DETAIL_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(OrderDetail),
    inject: ['DATA_SOURCE'],
  },
];
