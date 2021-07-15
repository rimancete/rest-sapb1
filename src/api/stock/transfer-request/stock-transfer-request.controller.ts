import { Controller, Headers, Body, Post } from '@nestjs/common';
import { StockTransferRequestService } from './stock-transfer-request.service';
import { StockTransferRequestRequest, StockTransferRequestResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Stock')
@Controller('stock')
export class StockTransferRequestController {

	constructor(private readonly stockTransferRequestService: StockTransferRequestService) { }

	@Post('transfer-request')
	@ApiHeader({ name: 'token', required: true })
	@ApiCreatedResponse({ type: StockTransferRequestResult })
	async insertTransferRequest(@Headers('token') token, @Body() movementRequest: StockTransferRequestRequest): Promise<StockTransferRequestResult> {
		return await this.stockTransferRequestService.insertTransferRequest(token, movementRequest);
	}

}

