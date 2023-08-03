import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  AppException,
  AppExceptionBody,
} from 'src/common/exeptions/app.exception';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Order } from '../orders/entities/order.entity';
@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
  ) {}

  async updatePaymentStatus(updatePayment: UpdatePaymentStatusDto) {
    const order = await this.orderModel.findByPk(updatePayment.order_id);
    if (!order) {
      throw AppException.notFoundException(AppExceptionBody.orderNotFound());
    }
    await this.orderModel.update(
      {
        payment_status_id: updatePayment.payment_status_id,
      },
      {
        where: { id: updatePayment.order_id },
        returning: true,
      },
    );
  }
}
