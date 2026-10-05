import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('OrderDetails')
export class OrderDetail {
    @PrimaryGeneratedColumn()
    order_detail_id: number;

    @Column()
    order_id: number;

    @Column()
    asset_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price_at_purchase: number;
}