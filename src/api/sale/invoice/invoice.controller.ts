import { Controller, Headers, Body, Post } from '@nestjs/common';
import { InvoiceService } from './invoice.service'
import { InvoiceRequest, InvoiceResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sale')
@Controller('sale')
export class InvoiceController {

	constructor(private readonly invoiceService: InvoiceService) { }

	@Post('invoice')
	@ApiHeader({ name: 'token', required: true })
	@ApiCreatedResponse({ type: InvoiceResult })
	async insertOrder(@Headers('token') token, @Body() invoiceRequest: InvoiceRequest): Promise<InvoiceResult> {
		return await this.invoiceService.insertOrUpdate(token, invoiceRequest);
	}

}

