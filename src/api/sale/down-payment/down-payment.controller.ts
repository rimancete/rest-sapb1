import { Controller, Headers, Body, Post } from '@nestjs/common';
import { DownPaymentRequest, DownPaymentsResult } from './interfaces/controller';
import { DownPaymentsService } from './down-payment.service';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sale')
@Controller('sale')
export class DownPaymentsController {

    constructor(private readonly downPaymentsService: DownPaymentsService) { }

    @Post('down-payment')
    @ApiHeader({ name: 'token', required: true })
    @ApiCreatedResponse({ type: DownPaymentsResult })
    async insertOrder(@Headers('token') token, @Body() downPaymentRequest: DownPaymentRequest): Promise<any> {
        return await this.downPaymentsService.insertOrUpdate(token, downPaymentRequest);
    }
}

