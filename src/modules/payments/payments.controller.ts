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
import { CustomValidationPipe } from 'src/common/validations/pipes/validation.pipe';
import { CreatePlaceOrderDto } from './dto/create-payment.dto';
import { GetAllOrdersDto } from './dto/get-all-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('calculate_price')
  create(@Body() createPlaceOrderDto: CreatePlaceOrderDto): Promise<any> {
    return this.paymentsService.calculatePrice(createPlaceOrderDto);
  }

  @Post('place_order')
  @UsePipes(new CustomValidationPipe())
  placeOrder(
    @Req() req: Request,
    @Body() createPaymentDto: CreatePlaceOrderDto,
  ) {
    return this.paymentsService.placeOrder(req.user['sub'], createPaymentDto);
  }

  @Get('orders')
  async findAllOrders(@Query() getAllOrdersDto: GetAllOrdersDto) {
    return this.paymentsService.findAllOrders(getAllOrdersDto);
  }

  @Patch('orders/:id')
  @HttpCode(204)
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.paymentsService.updateOrder(+id, updateOrderDto);
  }

  @Patch(':id')
  @HttpCode(204)
  updatePayment(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentsService.updatePayment(+id, updatePaymentDto);
  }

  @Get('orders/:id')
  findOrder(@Param('id') id: number) {
    return this.paymentsService.findOrder(id);
  }
}
