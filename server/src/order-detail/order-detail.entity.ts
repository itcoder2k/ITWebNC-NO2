import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('OrderDetails')
export class OrderDetail {
  @PrimaryGeneratedColumn({ name: 'order_detail_id' })
  order_detail_id: number;

  @Column({ type: 'int', name: 'order_id' })
  order_id: number;

  @Column({ type: 'int', name: 'asset_id' })
  asset_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_at_purchase: number;
}
