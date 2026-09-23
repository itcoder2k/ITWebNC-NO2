import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Categories')
export class Category {
    @PrimaryGeneratedColumn()
    category_id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100, unique: true })
    slug: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;
}