import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { EMAIL_QUEUE, PLACE_ORDER_EMAIL, REGISTER_ACCOUNT_EMAIL } from 'utils/contants';

@Injectable()
export class QueueService {
  constructor(@InjectQueue(EMAIL_QUEUE) private mailQueue: Queue) {}

  async sendRegisterAccountMail(email: String, name: String, phone: String) {
    const job = await this.mailQueue.add(REGISTER_ACCOUNT_EMAIL, {
      email: email,
      name: name,
      phone: phone,
    });
  }

  async sendPlaceOrderMail(
    email: String,
    name: String,
    carModel: String,
    pickUpDate: String,
    dropOffDate: String,
    totalCost: number,
    paymentMethod: String,
  ) {
    const job = await this.mailQueue.add(PLACE_ORDER_EMAIL, {
      email: email,
      name: name,
      car_model: carModel,
      pick_up_date: pickUpDate,
      drop_off_date: dropOffDate,
      total_cost: totalCost,
      payment_method: paymentMethod,
    });
  }
}
