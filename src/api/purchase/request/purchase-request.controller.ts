import { Controller, Headers, Body, Post } from '@nestjs/common';
import { PurchaseRequestService } from './purchase-request.service'
import { PurchaseRequestRequest, PurchaseRequestResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseRequestController {

	constructor(private readonly purchaseRequestService: PurchaseRequestService) { }

	@Post('request')
	@ApiHeader({ name: 'token', required: true })
	@ApiCreatedResponse({ type: PurchaseRequestResult })
	async insertMovement(@Headers('token') token, @Body() purchaseRequest: PurchaseRequestRequest): Promise<PurchaseRequestResult> {
		return await this.purchaseRequestService.insertRequest(token, purchaseRequest);
	}

}

