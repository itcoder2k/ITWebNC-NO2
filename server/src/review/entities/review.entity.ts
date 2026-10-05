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

    @Column()
    user_id: number;

    @Column()
    asset_id: number;

    @Column()
    rating: number;

    @Column({ type: 'text', nullable: true })
    comment: string | null;

    @CreateDateColumn()
    created_at: Date;
}