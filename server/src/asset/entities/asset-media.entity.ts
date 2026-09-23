import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('AssetMedia')
export class AssetMedia {
    @PrimaryGeneratedColumn()
    media_id: number;

    @Column({ type: 'int' })
    asset_id: number;

    @Column({ length: 255 })
    media_url: string;

    @Column({
        type: 'enum',
        enum: ['image', 'gif', 'video'],
        default: 'image',
    })
    media_type: string;

    @Column({ type: 'int', default: 0 })
    display_order: number;
}