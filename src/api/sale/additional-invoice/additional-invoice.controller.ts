import { Controller, Headers, Body, Post } from '@nestjs/common';
import { AdditionalInvoiceService } from './additional-invoice.service'
import { AdditionalInvoiceRequest, AdditionalInvoiceResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sale')
@Controller('sale')
export class AdditionalInvoiceController {

	constructor(private readonly additionalInvoiceService: AdditionalInvoiceService) { }

	@Post('additional-invoice')
	@ApiHeader({ name: 'token', required: true })
	@ApiCreatedResponse({ type: AdditionalInvoiceResult })
	async insertOrder(@Headers('token') token, @Body() additionalInvoiceRequest: AdditionalInvoiceRequest): Promise<AdditionalInvoiceResult> {
		return await this.additionalInvoiceService.insertOrUpdate(token, additionalInvoiceRequest);
	}

}

