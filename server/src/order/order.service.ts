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
import { CheckoutDto } from './dto/checkout.dto.js';
import { Order } from './entities/order.entity.js';

@Injectable()
export class OrderService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly dataSource: DataSource,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: Repository<Order>,
  ) {}

  async checkout(userId: number, checkoutDto: CheckoutDto): Promise<Order> {
    const payAmount = Number(checkoutDto.pay_amount);
    if (!Number.isFinite(payAmount) || payAmount < 0) {
      throw new BadRequestException('Số tiền thanh toán không hợp lệ');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      const userRepository = queryRunner.manager.getRepository(User);
      const assetRepository = queryRunner.manager.getRepository(Asset);
      const user = await userRepository.findOne({
        where: { user_id: userId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!user) {
        throw new NotFoundException('Không tìm thấy tài khoản người mua');
      }

      const asset = await assetRepository.findOne({
        where: { asset_id: checkoutDto.asset_id, status: 'active' },
        lock: { mode: 'pessimistic_write' },
      });
      if (!asset) {
        throw new NotFoundException(
          'Tài nguyên không tồn tại hoặc không hoạt động',
        );
      }
      if (asset.uploader_id === userId) {
        throw new BadRequestException(
          'Bạn không thể mua tài nguyên của chính mình',
        );
      }

      const existingPurchase = await queryRunner.manager
        .getRepository(OrderDetail)
        .createQueryBuilder('detail')
        .innerJoin(Order, 'order', 'order.order_id = detail.order_id')
        .where('order.user_id = :userId', { userId })
        .andWhere('detail.asset_id = :assetId', {
          assetId: checkoutDto.asset_id,
        })
        .andWhere('order.status IN (:...statuses)', {
          statuses: ['Completed', 'completed'],
        })
        .getOne();
      if (existingPurchase) {
        throw new ConflictException('Bạn đã sở hữu tài nguyên này');
      }

      const minimumPrice = Number(asset.price);
      if (payAmount < minimumPrice) {
        throw new BadRequestException(
          `Số tiền thanh toán phải tối thiểu là ${minimumPrice.toFixed(2)}`,
        );
      }
      if (payAmount > 99999999.99) {
        throw new BadRequestException('Số tiền thanh toán vượt quá giới hạn');
      }

      const balance = Number(user.balance);
      if (balance < payAmount) {
        throw new BadRequestException('Số dư ví không đủ để thanh toán');
      }

      user.balance = Number((balance - payAmount).toFixed(2));
      await userRepository.save(user);

      if (asset.uploader_id !== null) {
        const creator = await userRepository.findOne({
          where: { user_id: asset.uploader_id },
          lock: { mode: 'pessimistic_write' },
        });
        if (creator) {
          creator.balance = Number(
            (Number(creator.balance) + payAmount).toFixed(2),
          );
          await userRepository.save(creator);
        }
      }

      const order = await queryRunner.manager.getRepository(Order).save(
        queryRunner.manager.getRepository(Order).create({
          user_id: userId,
          total_amount: payAmount,
          payment_method: 'wallet',
          status: 'Completed',
        }),
      );
      await queryRunner.manager.getRepository(OrderDetail).save(
        queryRunner.manager.getRepository(OrderDetail).create({
          order_id: order.order_id,
          asset_id: asset.asset_id,
          price_at_purchase: payAmount,
        }),
      );

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

  async findMyOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async findMyLibrary(userId: number): Promise<
    Array<{
      asset_id: number;
      title: string;
      thumbnail_url: string | null;
      file_url: string;
      license: string;
      price_at_purchase: number;
      purchased_at: Date;
    }>
  > {
    return this.dataSource.query(
      `SELECT a.asset_id, a.title, a.thumbnail_url, a.file_url, a.license,
              od.price_at_purchase, o.created_at AS purchased_at
       FROM OrderDetails od
       INNER JOIN Orders o ON o.order_id = od.order_id
       INNER JOIN Assets a ON a.asset_id = od.asset_id
       WHERE o.user_id = ? AND o.status IN ('Completed', 'completed')
       ORDER BY o.created_at DESC`,
      [userId],
    );
  }
}
