import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import {
    SENDGRID_API_KEY,
    SENDGRID_PLACE_ORDER_TEMPLATE_ID,
    SENDGRID_REGISTER_ACCOUNT_TEMPLATE_ID,
    SENDGRID_SUPPORT_EMAIL,
} from 'src/enviroments';
import {
    EMAIL_QUEUE,
    PLACE_ORDER_EMAIL,
    REGISTER_ACCOUNT_EMAIL,
} from 'utils/contants';

@Processor(EMAIL_QUEUE)
export class QueueConsumer {
  private readonly sgMail = require('@sendgrid/mail');
  constructor() {
    this.sgMail.setApiKey(SENDGRID_API_KEY);
  }

  @Process(REGISTER_ACCOUNT_EMAIL)
  processRegisterAccountJob(job: Job<unknown>) {
    const email = job.data['email'];
    const name = job.data['name'];
    const phone = job.data['phone'];

    const msg = {
      to: email,
      from: SENDGRID_SUPPORT_EMAIL,
      templateId: SENDGRID_REGISTER_ACCOUNT_TEMPLATE_ID,
      dynamicTemplateData: {
        user_name: name,
        user_email: email,
        phone: phone,
        support_mail: SENDGRID_SUPPORT_EMAIL,
      },
    };
    console.log('content: ' + JSON.stringify(msg));
    this.sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  @Process(PLACE_ORDER_EMAIL)
  processPlaceOrderJob(job: Job<unknown>) {
    const email = job.data['email'];
    const name = job.data['name'];
    const car_model = job.data['car_model'];
    const pick_up_date = job.data['pick_up_date'];
    const drop_off_date = job.data['drop_off_date'];
    const total_cost = job.data['total_cost'];
    const payment_method = job.data['payment_method'];

    const msg = {
      to: email,
      from: SENDGRID_SUPPORT_EMAIL,
      templateId: SENDGRID_PLACE_ORDER_TEMPLATE_ID,
      dynamicTemplateData: {
        user_name: name,
        car_model: car_model,
        pick_up_date: pick_up_date,
        drop_off_date: drop_off_date,
        total_cost: total_cost,
        payment_method: payment_method,
        support_mail: SENDGRID_SUPPORT_EMAIL,
      },
    };
    console.log('content: ' + JSON.stringify(msg));
    this.sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent successfully!');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
