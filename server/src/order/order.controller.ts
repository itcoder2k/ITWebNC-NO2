import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { OrderService } from './order.service.js';

@Controller('order')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  checkout(
    @Request() req: { user: { user_id: number } },
    @Body() checkoutDto: CheckoutDto,
  ) {
    return this.orderService.checkout(req.user.user_id, checkoutDto);
  }

  @Get('my-orders')
  findMyOrders(@Request() req: { user: { user_id: number } }) {
    return this.orderService.findMyOrders(req.user.user_id);
  }

  @Get('history')
  findHistory(@Request() req: { user: { user_id: number } }) {
    return this.orderService.findMyOrders(req.user.user_id);
  }

  @Get('my-library')
  findMyLibrary(@Request() req: { user: { user_id: number } }) {
    return this.orderService.findMyLibrary(req.user.user_id);
  }

  @Get(':id')
  findOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: { user_id: number } },
  ) {
    return this.orderService.findOrderById(id, req.user.user_id);
  }
}
