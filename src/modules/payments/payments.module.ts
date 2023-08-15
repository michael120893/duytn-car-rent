import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [SequelizeModule.forFeature([Order])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
