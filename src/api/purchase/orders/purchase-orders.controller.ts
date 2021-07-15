import { Controller, Headers, Body, Post } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service'
import { PurchaseOrdersRequest, PurchaseOrdersResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseOrdersController {

	constructor(private readonly purchaseOrdersService: PurchaseOrdersService) { }

	@Post('orders')
	@ApiHeader({ name: 'token', required: true })
	@ApiCreatedResponse({ type: PurchaseOrdersResult })
	async insertOrder(@Headers('token') token, @Body() purchaseOrderRequest: PurchaseOrdersRequest): Promise<PurchaseOrdersResult> {
		return await this.purchaseOrdersService.insertOrUpdate(token, purchaseOrderRequest);
	}

}

