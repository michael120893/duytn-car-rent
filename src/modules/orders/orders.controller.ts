import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetAllOrdersDto } from '../payments/dto/get-all-orders.dto';
import { UpdateOrderStatusDto } from '../payments/dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from '../payments/dto/update-payment-status.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async findAllOrders(@Query() getAllOrdersDto: GetAllOrdersDto) {
    return this.ordersService.findAllOrders(getAllOrdersDto);
  }

  @Patch(':id')
  @HttpCode(204)
  @Roles(Role.Admin)
  updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrder(+id, updateOrderDto);
  }

  @Patch(':id/payment-status')
  @HttpCode(204)
  @Roles(Role.Admin)
  updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentStatusDto,
  ) {
    return this.ordersService.updatePayment(+id, updatePaymentDto);
  }

  @Get(':id')
  findOrder(@Param('id') id: number) {
    return this.ordersService.findOrder(id);
  }
}
