import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Orders')
export class Order {
  @PrimaryGeneratedColumn({ name: 'order_id' })
  order_id: number;

  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  total_amount: number;

  @Column({ type: 'varchar', length: 50, default: 'wallet' })
  payment_method: string;

  @Column({
    type: 'enum',
    enum: [
      'Pending',
      'Completed',
      'Cancelled',
      'pending',
      'completed',
      'cancelled',
    ],
    default: 'Completed',
  })
  status: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
