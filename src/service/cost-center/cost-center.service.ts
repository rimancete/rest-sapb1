import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmCostCenterService } from '../../core/simple-farm/cost-center/cost-center.service';
import { HanaCostCenterService } from '../../core/b1/hana/cost-center/cost-center.service'
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';
import * as _ from 'lodash';

@Injectable()
export class CostCenterService extends Runner {

	private logger = new Logger(CostCenterService.name);

	constructor(
		private readonly simpleFarmCostCenterService: SimpleFarmCostCenterService,
		private readonly hanaCostCenterService: HanaCostCenterService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		let records = await this.hanaCostCenterService.getNotIntegrated();
		records = records.filter(r => _.isInteger(_.parseInt(r.Code)));

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
				const responseObject = await this.simpleFarmCostCenterService.upsert(record);
				await this.hanaCostCenterService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.COST_CENTER, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.COST_CENTER, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}
}