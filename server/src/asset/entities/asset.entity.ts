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

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ length: 255, nullable: true })
  thumbnail_url: string | null;

  @Column({ length: 255 })
  file_url: string;

  @Column({ type: 'int', default: 0 })
  downloads_count: number;

  @Column({ type: 'int', nullable: true })
  uploader_id: number | null;

  @Column({ type: 'int', nullable: true })
  category_id: number | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
