import { Test, TestingModule } from '@nestjs/testing';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { OrderController } from './order.controller.js';
import { OrderService } from './order.service.js';

describe('OrderController', () => {
  let controller: OrderController;
  let mockOrderService: any;

  beforeEach(async () => {
    mockOrderService = {
      checkout: vi.fn(),
      findMyOrders: vi.fn(),
      findMyLibrary: vi.fn(),
      findOrderById: vi.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call orderService.checkout', async () => {
    const dto = { asset_id: 1, pay_amount: 10 };
    mockOrderService.checkout.mockResolvedValue({ order_id: 1, total_amount: 10 });

    const result = await controller.checkout({ user: { user_id: 5 } }, dto);
    expect(mockOrderService.checkout).toHaveBeenCalledWith(5, dto);
    expect(result.order_id).toBe(1);
  });

  it('should call orderService.findMyOrders for findMyOrders and findHistory', async () => {
    mockOrderService.findMyOrders.mockResolvedValue([{ order_id: 1 }]);

    const orders = await controller.findMyOrders({ user: { user_id: 5 } });
    expect(mockOrderService.findMyOrders).toHaveBeenCalledWith(5);
    expect(orders).toHaveLength(1);

    const history = await controller.findHistory({ user: { user_id: 5 } });
    expect(history).toHaveLength(1);
  });

  it('should call orderService.findMyLibrary', async () => {
    mockOrderService.findMyLibrary.mockResolvedValue([{ asset_id: 2 }]);

    const library = await controller.findMyLibrary({ user: { user_id: 5 } });
    expect(mockOrderService.findMyLibrary).toHaveBeenCalledWith(5);
    expect(library).toHaveLength(1);
  });

  it('should call orderService.findOrderById', async () => {
    mockOrderService.findOrderById.mockResolvedValue({ order_id: 12 });

    const order = await controller.findOrderById(12, { user: { user_id: 5 } });
    expect(mockOrderService.findOrderById).toHaveBeenCalledWith(12, 5);
    expect(order.order_id).toBe(12);
  });
});
