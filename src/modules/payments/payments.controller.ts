import { Body, Controller, Post, Req, UsePipes } from '@nestjs/common';
import { Request } from 'express';
import { ResponseUtil } from 'src/common/customs/base.response';
import { CustomValidationPipe } from 'src/common/validations/pipes/validation.pipe';
import { CreatePlaceOrderDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('calculate_price')
  create(@Body() createPlaceOrderDto: CreatePlaceOrderDto): Promise<any> {
    return ResponseUtil.generateResponse({
      response: this.paymentsService.calculatePrice(createPlaceOrderDto),
    });
  }

  @Post('place_order')
  @UsePipes(new CustomValidationPipe())
  placeOrder(
    @Req() req: Request,
    @Body() createPaymentDto: CreatePlaceOrderDto,
  ) {
    return ResponseUtil.generateResponse({
      response: this.paymentsService.placeOrder(
        req.user['sub'],
        createPaymentDto,
      ),
    });
  }
}
