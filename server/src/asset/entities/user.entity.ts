import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Users')
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ length: 100, nullable: true })
    display_name: string | null;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ length: 255 })
    password_hash: string;

    @Column({ length: 255, nullable: true })
    avatar_url: string | null;

    @Column({
        type: 'enum',
        enum: ['admin', 'creator', 'customer'],
        default: 'customer',
    })
    role: string;

    @Column({ type: 'text', nullable: true })
    bio: string | null;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    balance: number;

    @CreateDateColumn()
    created_at: Date;
}