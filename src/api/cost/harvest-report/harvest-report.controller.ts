import { Controller, Headers, Body, Post } from '@nestjs/common';
import { HarvestReportService } from './harvest-report.service';
import { HarvestReportRequest, HarvestReportResult } from './interfaces/controller';
import { ApiHeader, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cost')
@Controller('cost')
export class HarvestReportController {

	constructor(private readonly harvestReportService: HarvestReportService) { }

	@Post('harvest-report')
	@ApiHeader({ name: 'token', required: true })
	@ApiCreatedResponse({ type: HarvestReportResult })
	async insertHarvestReport(@Headers('token') token, @Body() request: HarvestReportRequest): Promise<HarvestReportResult> {
		return await this.harvestReportService.insertRequest(token, request);
	}

}

