import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Tags')
export class Tag {
    @PrimaryGeneratedColumn()
    tag_id: number;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 100 })
    slug: string;
}