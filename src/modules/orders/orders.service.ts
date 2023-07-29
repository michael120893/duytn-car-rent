import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AppException } from 'src/common/customs/custom.exception';
import { Coupon } from 'src/modules/payments/entities/coupon.entity';
import { Order } from 'src/modules/payments/entities/order.entity';
import { Paging } from '../cars/dto/paging.dto';
import { GetAllOrdersDto } from '../payments/dto/get-all-orders.dto';
import { UpdateOrderStatusDto } from '../payments/dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from '../payments/dto/update-payment-status.dto';
import { PaymentMethod } from '../payments/entities/payment.method.entity';
import { PaymentStatus } from '../payments/entities/payment.status.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
  ) {}

  async findAllOrders(getAllOrdersDto: GetAllOrdersDto) {
    const { limit, offset } = getAllOrdersDto;
    const result = await this.orderModel.findAndCountAll({
      include: [PaymentMethod, PaymentStatus, Coupon],
      limit: +limit,
      offset: +offset,
    });

    return new Paging(result.rows, {
      total: result.count,
      limit: +limit,
      offset: +offset,
    });
  }

  async findOrder(id: number): Promise<Order> {
    const order = await this.orderModel.findOne({
      include: [PaymentMethod, PaymentStatus, Coupon],
      where: {
        id: id,
      },
    });
    if (order) return order;

    throw AppException.notFoundException({
      title: `order_id ${id} is not found`,
    });
  }

  async updateOrder(id: number, updateOrder: UpdateOrderStatusDto) {
    const order = await this.findOrder(id);
    if (!order) {
      throw AppException.notFoundException({
        title: `order_id ${id} is not found`,
      });
    }
    await this.orderModel.update(
      {
        order_status_id: updateOrder.order_status_id,
      },
      {
        where: { id },
        returning: true,
      },
    );
  }

  async updatePayment(id: number, updatePayment: UpdatePaymentStatusDto) {
    const order = await this.findOrder(id);
    if (!order) {
      throw AppException.notFoundException({
        title: `order_id ${id} is not found`,
      });
    }
    await this.orderModel.update(
      {
        payment_status_id: updatePayment.payment_status_id,
      },
      {
        where: { id },
        returning: true,
      },
    );
  }
}
