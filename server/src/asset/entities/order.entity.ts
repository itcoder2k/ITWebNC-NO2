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

    @Column({ type: 'int', nullable: true })
    user_id: number | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @Column({ length: 50, default: 'wallet' })
    payment_method: string;

    @Column({
        type: 'enum',
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending',
    })
    status: string;

    @CreateDateColumn()
    created_at: Date;
}