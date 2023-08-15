import { Body, Controller, HttpCode, Patch } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { PaymentsService } from './payments.service';
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Patch()
  @HttpCode(204)
  @Roles(Role.Admin)
  updatePaymentStatus(@Body() updatePaymentDto: UpdatePaymentStatusDto) {
    return this.paymentsService.updatePaymentStatus(updatePaymentDto);
  }
}
