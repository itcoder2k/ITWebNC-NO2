import {
    Column,
    Entity,
    PrimaryColumn,
} from 'typeorm';

@Entity('AssetTags')
export class AssetTag {
    @PrimaryColumn()
    asset_id: number;

    @PrimaryColumn()
    tag_id: number;
}