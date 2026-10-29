import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AssetService } from './asset.service.js';
import { Asset } from './entities/asset.entity.js';

describe('AssetService', () => {
  let service: AssetService;
  let assetRepository: any;
  let dataSource: any;

  beforeEach(async () => {
    assetRepository = {
      create: vi.fn((dto) => ({ ...dto })),
      save: vi.fn((asset) => Promise.resolve(asset)),
      find: vi.fn(),
      findOne: vi.fn(),
      findOneBy: vi.fn(),
      increment: vi.fn(),
      merge: vi.fn((target, source) => Object.assign(target, source)),
    };
    dataSource = { query: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        { provide: 'ASSET_REPOSITORY', useValue: assetRepository },
        { provide: 'DATA_SOURCE', useValue: dataSource },
      ],
    }).compile();

    service = module.get(AssetService);
  });

  it('should archive an owned asset instead of using an invalid status', async () => {
    const asset = { asset_id: 1, uploader_id: 2, status: 'active' } as Asset;
    assetRepository.findOneBy.mockResolvedValue(asset);

    const result = await service.remove(1, 2, false);

    expect(asset.status).toBe('archived');
    expect(assetRepository.save).toHaveBeenCalledWith(asset);
    expect(result.message).toContain('thành công');
  });

  it('should allow an admin to archive any asset', async () => {
    const asset = { asset_id: 1, uploader_id: 2, status: 'active' } as Asset;
    assetRepository.findOneBy.mockResolvedValue(asset);

    await service.remove(1, 99, true);

    expect(asset.status).toBe('archived');
  });

  it('should reject removing an asset owned by another creator', async () => {
    assetRepository.findOneBy.mockResolvedValue({
      asset_id: 1,
      uploader_id: 2,
      status: 'active',
    });

    await expect(service.remove(1, 99, false)).rejects.toThrow(ForbiddenException);
  });

  it('should throw NotFoundException when removing a missing asset', async () => {
    assetRepository.findOneBy.mockResolvedValue(null);

    await expect(service.remove(999, 1, false)).rejects.toThrow(NotFoundException);
  });
});
