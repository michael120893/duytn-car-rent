import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { CustomValidationPipe } from 'src/common/validations/pipes/validation.pipe';
import { CreatePlaceOrderDto } from '../payments/dto/create-payment.dto';
import { GetAllOrdersDto } from '../payments/dto/get-all-orders.dto';
import { UpdateOrderStatusDto } from '../payments/dto/update-order-status.dto';
import { OrdersService } from './orders.service';

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

  @Get(':id')
  findOrder(@Param('id') id: number) {
    return this.ordersService.findOrder(id);
  }

  @Post('calculate_price')
  create(@Body() createPlaceOrderDto: CreatePlaceOrderDto): Promise<any> {
    return this.ordersService.calculatePrice(createPlaceOrderDto);
  }

  @Post('place_order')
  @UsePipes(new CustomValidationPipe())
  placeOrder(
    @Req() req: Request,
    @Body() createPaymentDto: CreatePlaceOrderDto,
  ) {
    return this.ordersService.placeOrder(req.user['sub'], createPaymentDto);
  }
}
