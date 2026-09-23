import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Tags')
export class Tag {
    @PrimaryGeneratedColumn()
    tag_id: number;

    @Column({ length: 50, unique: true })
    name: string;

    @Column({ length: 50, unique: true })
    slug: string;
}