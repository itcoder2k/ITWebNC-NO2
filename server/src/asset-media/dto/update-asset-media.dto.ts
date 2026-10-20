import { PartialType } from '@nestjs/mapped-types';
import { CreateAssetMediaDto } from './create-asset-media.dto.js';

export class UpdateAssetMediaDto extends PartialType(CreateAssetMediaDto) {}
