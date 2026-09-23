import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Assets')
export class Asset {
  @PrimaryGeneratedColumn()
  asset_id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 255, nullable: true })
  short_description: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ length: 255, nullable: true })
  thumbnail_url: string | null;

  @Column({ length: 255 })
  file_url: string;

  @Column({ type: 'bigint', default: 0 })
  file_size: number;

  @Column({ length: 100, default: 'Standard Commercial' })
  license: string;

  @Column({ type: 'int', default: 0 })
  views_count: number;

  @Column({ type: 'int', default: 0 })
  downloads_count: number;

  @Column({
    type: 'enum',
    enum: ['active', 'archived', 'pending'],
    default: 'active',
  })
  status: string;

  @Column({ type: 'int', nullable: true })
  uploader_id: number | null;

  @Column({ type: 'int', nullable: true })
  category_id: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}