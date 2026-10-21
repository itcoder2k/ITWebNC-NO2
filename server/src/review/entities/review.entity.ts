import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Reviews')
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  review_id: number;

  @Column({ type: 'int', name: 'user_id' })
  user_id: number;

  @Column({ type: 'int', name: 'asset_id' })
  asset_id: number;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;
}
