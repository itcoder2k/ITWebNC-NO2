import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  user_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'creator', 'customer'],
    default: 'customer',
  })
  role: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  balance: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
