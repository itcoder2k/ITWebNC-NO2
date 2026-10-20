import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tag } from './tag.entity.js';
import { Asset } from '../../asset/entities/asset.entity.js';

@Entity('AssetTags')
export class AssetTag {
  @PrimaryColumn({ type: 'int' })
  asset_id: number;

  @Index('idx_assettags_tag')
  @PrimaryColumn({ type: 'int' })
  tag_id: number;

  @ManyToOne(() => Asset, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'asset_id' })
  asset?: Asset;

  @ManyToOne(() => Tag, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'tag_id' })
  tag?: Tag;
}
