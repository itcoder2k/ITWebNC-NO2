import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Asset } from '../asset/entities/asset.entity.js';
import { OrderDetail } from '../order-detail/order-detail.entity.js';
import { User } from '../user/entities/user.entity.js';
import { CheckoutDto, CheckoutItemDto } from './dto/checkout.dto.js';
import { Order } from './entities/order.entity.js';

export interface LibraryItem {
  asset_id: number;
  title: string;
  thumbnail_url: string | null;
  file_url: string;
  file_size: number;
  license: string;
  short_description: string | null;
  price_at_purchase: number;
  purchased_at: Date;
  author_name: string;
}

@Injectable()
export class OrderService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: Repository<Order>,
    @Inject('ORDER_DETAIL_REPOSITORY')
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  /**
   * ACID Transaction Checkout supporting both single asset and multi-item shopping carts
   * Implements Pay-What-You-Want (PWYW), wallet deduction, and creator revenue sharing
   */
  async checkout(userId: number, checkoutDto: CheckoutDto): Promise<Order> {
    // 1. Resolve checkout items (supports single item or full cart items array)
    let itemsToProcess: CheckoutItemDto[] = [];
    if (checkoutDto.items && Array.isArray(checkoutDto.items) && checkoutDto.items.length > 0) {
      itemsToProcess = checkoutDto.items;
    } else if (
      checkoutDto.asset_id !== undefined &&
      checkoutDto.pay_amount !== undefined
    ) {
      itemsToProcess = [
        {
          asset_id: checkoutDto.asset_id,
          pay_amount: checkoutDto.pay_amount,
        },
      ];
    } else {
      throw new BadRequestException(
        'Vui lòng cung cấp thông tin tài nguyên hoặc giỏ hàng cần thanh toán',
      );
    }

    // 2. Validate items integrity and duplicates
    const seenAssetIds = new Set<number>();
    let totalPayAmount = 0;

    for (const item of itemsToProcess) {
      const assetId = Number(item.asset_id);
      const payAmount = Number(item.pay_amount);

      if (!Number.isInteger(assetId) || assetId <= 0) {
        throw new BadRequestException(`Mã tài nguyên #${item.asset_id} không hợp lệ`);
      }
      if (seenAssetIds.has(assetId)) {
        throw new BadRequestException(`Tài nguyên #${assetId} bị trùng lặp trong đơn hàng`);
      }
      seenAssetIds.add(assetId);

      if (!Number.isFinite(payAmount) || payAmount < 0) {
        throw new BadRequestException(`Số tiền thanh toán cho tài nguyên #${assetId} không hợp lệ`);
      }
      totalPayAmount += payAmount;
    }

    if (totalPayAmount > 99999999.99) {
      throw new BadRequestException('Tổng số tiền thanh toán vượt quá giới hạn hệ thống');
    }

    // 3. Begin ACID Database Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const userRepository = queryRunner.manager.getRepository(User);
      const assetRepository = queryRunner.manager.getRepository(Asset);
      const orderRepo = queryRunner.manager.getRepository(Order);
      const orderDetailRepo = queryRunner.manager.getRepository(OrderDetail);

      // Lock buyer record for concurrency control
      const buyer = await userRepository.findOne({
        where: { user_id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!buyer) {
        throw new NotFoundException('Không tìm thấy tài khoản người mua');
      }

      const buyerBalance = Number(buyer.balance);
      if (buyerBalance < totalPayAmount) {
        throw new BadRequestException(
          `Số dư ví ($${buyerBalance.toFixed(2)}) không đủ để thanh toán tổng đơn hàng ($${totalPayAmount.toFixed(2)})`,
        );
      }

      // Validate each asset, ownership, and PWYW minimum floor price
      const validatedAssets: Array<{ asset: Asset; itemPay: number }> = [];

      for (const item of itemsToProcess) {
        const itemPay = Number(item.pay_amount);

        const asset = await assetRepository.findOne({
          where: { asset_id: item.asset_id, status: 'active' },
          lock: { mode: 'pessimistic_write' },
        });
        if (!asset) {
          throw new NotFoundException(
            `Tài nguyên #${item.asset_id} không tồn tại hoặc đã bị ẩn`,
          );
        }

        if (asset.uploader_id === userId) {
          throw new BadRequestException(
            `Bạn không thể mua tài nguyên của chính mình: "${asset.title}"`,
          );
        }

        // Check if buyer already owns this asset
        const existingPurchase = await orderDetailRepo
          .createQueryBuilder('detail')
          .innerJoin(Order, 'order', 'order.order_id = detail.order_id')
          .where('order.user_id = :userId', { userId })
          .andWhere('detail.asset_id = :assetId', { assetId: item.asset_id })
          .andWhere('order.status IN (:...statuses)', {
            statuses: ['Completed', 'completed'],
          })
          .getOne();

        if (existingPurchase) {
          throw new ConflictException(
            `Bạn đã sở hữu tài nguyên: "${asset.title}"`,
          );
        }

        const minimumPrice = Number(asset.price);
        if (itemPay < minimumPrice) {
          throw new BadRequestException(
            `Số tiền thanh toán cho "${asset.title}" phải tối thiểu là $${minimumPrice.toFixed(2)} (giá sàn PWYW)`,
          );
        }

        validatedAssets.push({ asset, itemPay });
      }

      // Deduct buyer's wallet balance
      buyer.balance = Number((buyerBalance - totalPayAmount).toFixed(2));
      await userRepository.save(buyer);

      // Group and credit revenue to creators
      const creatorEarnings = new Map<number, number>();
      for (const { asset, itemPay } of validatedAssets) {
        if (asset.uploader_id !== null && asset.uploader_id !== undefined) {
          const currentEarn = creatorEarnings.get(asset.uploader_id) || 0;
          creatorEarnings.set(asset.uploader_id, currentEarn + itemPay);
        }
      }

      for (const [creatorId, earnAmount] of creatorEarnings.entries()) {
        const creator = await userRepository.findOne({
          where: { user_id: creatorId },
          lock: { mode: 'pessimistic_write' },
        });
        if (creator) {
          creator.balance = Number(
            (Number(creator.balance) + earnAmount).toFixed(2),
          );
          await userRepository.save(creator);
        }
      }

      // Create Order record (Single ACID transaction for entire checkout)
      const order = await orderRepo.save(
        orderRepo.create({
          user_id: userId,
          total_amount: Number(totalPayAmount.toFixed(2)),
          payment_method: 'wallet',
          status: 'Completed',
        }),
      );

      // Create OrderDetail records for each item
      for (const { asset, itemPay } of validatedAssets) {
        await orderDetailRepo.save(
          orderDetailRepo.create({
            order_id: order.order_id,
            asset_id: asset.asset_id,
            price_at_purchase: Number(itemPay.toFixed(2)),
          }),
        );
      }

      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Get user's order history with details and items
   */
  async findMyOrders(userId: number): Promise<any[]> {
    const orders = await this.orderRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    if (orders.length === 0) return [];

    const orderIds = orders.map((o) => o.order_id);
    const details = await this.dataSource.query(
      `SELECT od.order_detail_id, od.order_id, od.asset_id, od.price_at_purchase,
              a.title AS asset_title, a.thumbnail_url, a.file_url, a.license
       FROM OrderDetails od
       INNER JOIN Assets a ON a.asset_id = od.asset_id
       WHERE od.order_id IN (?)`,
      [orderIds],
    );

    const detailsByOrder = new Map<number, any[]>();
    for (const d of details) {
      if (!detailsByOrder.has(d.order_id)) {
        detailsByOrder.set(d.order_id, []);
      }
      detailsByOrder.get(d.order_id)!.push(d);
    }

    return orders.map((order) => ({
      ...order,
      items: detailsByOrder.get(order.order_id) || [],
    }));
  }

  /**
   * Get details for a single order owned by user
   */
  async findOrderById(orderId: number, userId: number): Promise<any> {
    const order = await this.orderRepository.findOne({
      where: { order_id: orderId, user_id: userId },
    });
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng #${orderId}`);
    }

    const items = await this.dataSource.query(
      `SELECT od.order_detail_id, od.order_id, od.asset_id, od.price_at_purchase,
              a.title AS asset_title, a.thumbnail_url, a.file_url, a.license
       FROM OrderDetails od
       INNER JOIN Assets a ON a.asset_id = od.asset_id
       WHERE od.order_id = ?`,
      [orderId],
    );

    return {
      ...order,
      items,
    };
  }

  /**
   * Get all games and assets owned by user (deduplicated)
   */
  async findMyLibrary(userId: number): Promise<LibraryItem[]> {
    return this.dataSource.query(
      `SELECT a.asset_id, a.title, a.thumbnail_url, a.file_url, a.file_size, a.license,
              a.short_description, MAX(od.price_at_purchase) AS price_at_purchase,
              MAX(o.created_at) AS purchased_at,
              COALESCE(u.display_name, u.username, 'Indie Creator') AS author_name
       FROM OrderDetails od
       INNER JOIN Orders o ON o.order_id = od.order_id
       INNER JOIN Assets a ON a.asset_id = od.asset_id
       LEFT JOIN Users u ON u.user_id = a.uploader_id
       WHERE o.user_id = ? AND o.status IN ('Completed', 'completed')
       GROUP BY a.asset_id, a.title, a.thumbnail_url, a.file_url, a.file_size,
                a.license, a.short_description, u.display_name, u.username
       ORDER BY purchased_at DESC`,
      [userId],
    );
  }
}
