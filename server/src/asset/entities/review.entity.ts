import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Reviews')
export class Review {
    @PrimaryGeneratedColumn()
    review_id: number;

    @Column({ type: 'int' })
    user_id: number;

    @Column({ type: 'int' })
    asset_id: number;

    @Column({ type: 'tinyint' })
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string | null;

    @CreateDateColumn()
    created_at: Date;
}