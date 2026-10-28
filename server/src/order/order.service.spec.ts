import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { OrderService } from './order.service.js';

describe('OrderService', () => {
  let service: OrderService;
  let mockDataSource: any;
  let mockOrderRepository: any;
  let mockOrderDetailRepository: any;
  let mockQueryRunner: any;

  beforeEach(async () => {
    mockQueryRunner = {
      connect: vi.fn().mockResolvedValue(undefined),
      startTransaction: vi.fn().mockResolvedValue(undefined),
      commitTransaction: vi.fn().mockResolvedValue(undefined),
      rollbackTransaction: vi.fn().mockResolvedValue(undefined),
      release: vi.fn().mockResolvedValue(undefined),
      isTransactionActive: true,
      manager: {
        getRepository: vi.fn(),
      },
    };

    mockDataSource = {
      createQueryRunner: vi.fn().mockReturnValue(mockQueryRunner),
      query: vi.fn(),
    };

    mockOrderRepository = {
      find: vi.fn(),
      findOne: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };

    mockOrderDetailRepository = {
      find: vi.fn(),
      create: vi.fn(),
      save: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: 'DATA_SOURCE',
          useValue: mockDataSource,
        },
        {
          provide: 'ORDER_REPOSITORY',
          useValue: mockOrderRepository,
        },
        {
          provide: 'ORDER_DETAIL_REPOSITORY',
          useValue: mockOrderDetailRepository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkout', () => {
    it('should throw BadRequestException if no items provided', async () => {
      await expect(service.checkout(1, {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if items contain duplicates', async () => {
      await expect(
        service.checkout(1, {
          items: [
            { asset_id: 1, pay_amount: 10 },
            { asset_id: 1, pay_amount: 15 },
          ],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if buyer does not exist', async () => {
      const mockUserRepo = {
        findOne: vi.fn().mockResolvedValue(null),
      };
      mockQueryRunner.manager.getRepository.mockImplementation((entity: any) => {
        return mockUserRepo;
      });

      await expect(
        service.checkout(1, { asset_id: 10, pay_amount: 15 }),
      ).rejects.toThrow(NotFoundException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if buyer balance is insufficient', async () => {
      const mockUserRepo = {
        findOne: vi.fn().mockResolvedValue({ user_id: 1, balance: 5.0 }),
      };
      mockQueryRunner.manager.getRepository.mockImplementation(() => mockUserRepo);

      await expect(
        service.checkout(1, { asset_id: 10, pay_amount: 15.0 }),
      ).rejects.toThrow(BadRequestException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if asset is not found or inactive', async () => {
      const mockUserRepo = {
        findOne: vi.fn().mockResolvedValue({ user_id: 1, balance: 100.0 }),
      };
      const mockAssetRepo = {
        findOne: vi.fn().mockResolvedValue(null),
      };
      mockQueryRunner.manager.getRepository.mockImplementation((entity: any) => {
        if (entity.name === 'User') return mockUserRepo;
        return mockAssetRepo;
      });

      await expect(
        service.checkout(1, { asset_id: 99, pay_amount: 10 }),
      ).rejects.toThrow(NotFoundException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user tries to buy their own asset', async () => {
      const mockUserRepo = {
        findOne: vi.fn().mockResolvedValue({ user_id: 1, balance: 100.0 }),
      };
      const mockAssetRepo = {
        findOne: vi.fn().mockResolvedValue({
          asset_id: 10,
          title: 'My Game Asset',
          price: 5.0,
          uploader_id: 1, // Same as buyer
        }),
      };
      mockQueryRunner.manager.getRepository.mockImplementation((entity: any) => {
        if (entity.name === 'User') return mockUserRepo;
        return mockAssetRepo;
      });

      await expect(
        service.checkout(1, { asset_id: 10, pay_amount: 10 }),
      ).rejects.toThrow(BadRequestException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw ConflictException if user already owns the asset', async () => {
      const mockUserRepo = {
        findOne: vi.fn().mockResolvedValue({ user_id: 1, balance: 100.0 }),
      };
      const mockAssetRepo = {
        findOne: vi.fn().mockResolvedValue({
          asset_id: 10,
          title: 'Already Owned',
          price: 5.0,
          uploader_id: 2,
        }),
      };
      const mockDetailQB = {
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue({ order_detail_id: 5 }), // Already purchased
      };
      const mockDetailRepo = {
        createQueryBuilder: vi.fn().mockReturnValue(mockDetailQB),
      };

      mockQueryRunner.manager.getRepository.mockImplementation((entity: any) => {
        if (entity.name === 'User') return mockUserRepo;
        if (entity.name === 'Asset') return mockAssetRepo;
        return mockDetailRepo;
      });

      await expect(
        service.checkout(1, { asset_id: 10, pay_amount: 10 }),
      ).rejects.toThrow(ConflictException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw BadRequestException if pay amount is less than PWYW floor price', async () => {
      const mockUserRepo = {
        findOne: vi.fn().mockResolvedValue({ user_id: 1, balance: 100.0 }),
      };
      const mockAssetRepo = {
        findOne: vi.fn().mockResolvedValue({
          asset_id: 10,
          title: 'Floor Price Asset',
          price: 20.0,
          uploader_id: 2,
        }),
      };
      const mockDetailQB = {
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(null),
      };
      const mockDetailRepo = {
        createQueryBuilder: vi.fn().mockReturnValue(mockDetailQB),
      };

      mockQueryRunner.manager.getRepository.mockImplementation((entity: any) => {
        if (entity.name === 'User') return mockUserRepo;
        if (entity.name === 'Asset') return mockAssetRepo;
        return mockDetailRepo;
      });

      await expect(
        service.checkout(1, { asset_id: 10, pay_amount: 5.0 }), // 5.0 < 20.0 floor price
      ).rejects.toThrow(BadRequestException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should successfully complete checkout with ACID transaction and creator revenue', async () => {
      const buyer = { user_id: 1, balance: 50.0 };
      const creator = { user_id: 2, balance: 10.0 };
      const asset = {
        asset_id: 10,
        title: 'Pixel Knight',
        price: 15.0,
        uploader_id: 2,
      };

      const mockUserRepo = {
        findOne: vi.fn().mockImplementation(({ where }) => {
          if (where.user_id === 1) return Promise.resolve(buyer);
          if (where.user_id === 2) return Promise.resolve(creator);
          return Promise.resolve(null);
        }),
        save: vi.fn().mockImplementation((u) => Promise.resolve(u)),
      };

      const mockAssetRepo = {
        findOne: vi.fn().mockResolvedValue(asset),
      };

      const mockDetailQB = {
        innerJoin: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        andWhere: vi.fn().mockReturnThis(),
        getOne: vi.fn().mockResolvedValue(null),
      };

      const mockOrderRepo = {
        create: vi.fn().mockImplementation((dto) => ({ order_id: 101, ...dto })),
        save: vi.fn().mockImplementation((order) => Promise.resolve(order)),
      };

      const mockDetailRepo = {
        createQueryBuilder: vi.fn().mockReturnValue(mockDetailQB),
        create: vi.fn().mockImplementation((dto) => ({ order_detail_id: 201, ...dto })),
        save: vi.fn().mockImplementation((d) => Promise.resolve(d)),
      };

      mockQueryRunner.manager.getRepository.mockImplementation((entity: any) => {
        if (entity.name === 'User') return mockUserRepo;
        if (entity.name === 'Asset') return mockAssetRepo;
        if (entity.name === 'Order') return mockOrderRepo;
        return mockDetailRepo;
      });

      const orderResult = await service.checkout(1, {
        asset_id: 10,
        pay_amount: 20.0, // $15 base + $5 PWYW tip
      });

      expect(orderResult).toBeDefined();
      expect(orderResult.order_id).toBe(101);
      expect(orderResult.total_amount).toBe(20.0);
      expect(buyer.balance).toBe(30.0); // 50 - 20
      expect(creator.balance).toBe(30.0); // 10 + 20
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  describe('findMyOrders', () => {
    it('should return user orders enriched with items', async () => {
      mockOrderRepository.find.mockResolvedValue([
        { order_id: 1, user_id: 5, total_amount: 10.0, status: 'Completed' },
      ]);
      mockDataSource.query.mockResolvedValue([
        {
          order_detail_id: 1,
          order_id: 1,
          asset_id: 2,
          price_at_purchase: 10.0,
          asset_title: 'Cyberpunk Brawler',
          thumbnail_url: 'thumb.jpg',
        },
      ]);

      const orders = await service.findMyOrders(5);
      expect(orders).toHaveLength(1);
      expect(orders[0].items).toHaveLength(1);
      expect(orders[0].items[0].asset_title).toBe('Cyberpunk Brawler');
    });

    it('should return empty array if user has no orders', async () => {
      mockOrderRepository.find.mockResolvedValue([]);
      const orders = await service.findMyOrders(5);
      expect(orders).toEqual([]);
    });
  });

  describe('findOrderById', () => {
    it('should return order when found', async () => {
      mockOrderRepository.findOne.mockResolvedValue({
        order_id: 1,
        user_id: 5,
        total_amount: 10.0,
      });
      mockDataSource.query.mockResolvedValue([
        { order_detail_id: 1, order_id: 1, asset_id: 2, price_at_purchase: 10.0 },
      ]);

      const order = await service.findOrderById(1, 5);
      expect(order.order_id).toBe(1);
      expect(order.items).toHaveLength(1);
    });

    it('should throw NotFoundException when order does not exist or not owned', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);
      await expect(service.findOrderById(999, 5)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMyLibrary', () => {
    it('should return deduplicated library items', async () => {
      const mockItems = [
        {
          asset_id: 1,
          title: 'SunnyLand',
          thumbnail_url: 'sunnyland.png',
          file_url: '/uploads/assets/sunnyland.zip',
          price_at_purchase: 0.0,
          author_name: 'ansimuz',
        },
      ];
      mockDataSource.query.mockResolvedValue(mockItems);

      const library = await service.findMyLibrary(5);
      expect(library).toEqual(mockItems);
    });
  });
});
