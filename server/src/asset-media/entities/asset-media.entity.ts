import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('AssetMedia')
export class AssetMedia {
    @PrimaryGeneratedColumn()
    media_id: number;

    @Column()
    asset_id: number;

    @Column({ length: 255 })
    media_url: string;

    @Column({
        type: 'enum',
        enum: ['image', 'gif', 'video'],
    })
    media_type: string;

    @Column()
    display_order: number;
}