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
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
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
}
