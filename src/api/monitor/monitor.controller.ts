import { Controller, Get, Post, Body } from '@nestjs/common';
import { MonitorService } from './monitor.service'
import { LogsResult, CompanyLogsResult, LogsData, ApiLogsData, ApiGraphData } from './interfaces/controller';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
export class MonitorController {

	constructor(private readonly monitorService: MonitorService) { }

	@Get()
	@ApiCreatedResponse({ type: LogsResult })
	async getLogs(): Promise<LogsResult> {
		return await this.monitorService.getLogs();
	}

	@Get('overview')
	@ApiCreatedResponse({ type: CompanyLogsResult })
	async getCompanyLogs(): Promise<CompanyLogsResult> {
		return await this.monitorService.getOverviewLogs();
	}

	@Get('apiOverview')
	@ApiCreatedResponse({type: ApiLogsData})
	async getApiOverview(): Promise<any> {
		return await this.monitorService.getApiOverviewLogs();
	}

	@Get('apiGraph')
	@ApiCreatedResponse({type: ApiGraphData})
	async getApiGraph(): Promise<any> {
		return await this.monitorService.getApiGraph();
	}


	@Post('/logDetails')
	@ApiCreatedResponse({ type: LogsResult})
	async getLogDetails(@Body() request: LogsData): Promise <LogsResult> {
		return await this.monitorService.getLogDetails(request);
	}


}

