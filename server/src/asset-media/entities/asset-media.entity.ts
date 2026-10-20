import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Asset } from '../../asset/entities/asset.entity.js';

export enum MediaType {
  IMAGE = 'image',
  GIF = 'gif',
  AUDIO = 'audio',
  VIDEO = 'video',
}

@Entity('AssetMedia')
export class AssetMedia {
  @PrimaryGeneratedColumn({ name: 'media_id' })
  media_id: number;

  @Index('idx_assetmedia_asset')
  @Column({ type: 'int' })
  asset_id: number;

  @Column({ type: 'varchar', length: 255 })
  media_url: string;

  @Column({
    type: 'enum',
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  media_type: MediaType;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => Asset, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset?: Asset;
}