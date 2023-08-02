import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './entities/order.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [SequelizeModule.forFeature([Order])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
