import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('Categories')
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  category_id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Index('idx_category_slug', { unique: true })
  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}