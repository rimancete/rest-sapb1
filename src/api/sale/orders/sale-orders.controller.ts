import { Controller, Headers, Body, Post } from '@nestjs/common';
import { SaleOrdersService } from './sale-orders.service'
import { SaleOrdersRequest, SaleOrdersResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sale')
@Controller('sale')
export class SaleOrdersController {

  constructor(private readonly saleOrdersService: SaleOrdersService) { }

  @Post('orders')
  @ApiHeader({ name: 'token', required: true })
  @ApiCreatedResponse({ type: SaleOrdersResult })
  async insertOrder(@Headers('token') token: string, @Body() saleOrderRequest: SaleOrdersRequest): Promise<SaleOrdersResult> {
    return await this.saleOrdersService.insertOrUpdate(token, saleOrderRequest);
  }

}

