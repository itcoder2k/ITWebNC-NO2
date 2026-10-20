import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Tags')
export class Tag {
  @PrimaryGeneratedColumn({ name: 'tag_id' })
  tag_id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Index('idx_tag_slug')
  @Column({ type: 'varchar', length: 50, unique: true })
  slug: string;
}