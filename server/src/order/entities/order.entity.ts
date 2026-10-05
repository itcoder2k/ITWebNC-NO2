import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Orders')
export class Order {
    @PrimaryGeneratedColumn()
    order_id: number;

    @Column()
    user_id: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total_amount: number;

    @Column({
        type: 'enum',
        enum: ['wallet', 'vnpay', 'momo'],
    })
    payment_method: string;

    @Column({
        type: 'enum',
        enum: ['Pending', 'Completed', 'Cancelled'],
        default: 'Pending',
    })
    status: string;

    @CreateDateColumn()
    created_at: Date;
}