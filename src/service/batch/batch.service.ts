import { Injectable, Logger } from '@nestjs/common';
import { LogsService } from '../../core/logs/logs.service'
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';
import { HanaBatchService } from 'src/core/b1/hana/batch/batch.service';
import { SimpleFarmBatchService } from 'src/core/simple-farm/batch/batch.service';

@Injectable()
export class BatchService extends Runner {

	private logger = new Logger(BatchService.name);

	constructor(
    private readonly simpleFarmBatchService: SimpleFarmBatchService,
		private readonly hanaBatchservice: HanaBatchService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {
		const records = await this.hanaBatchservice.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
				const responseObject = await this.simpleFarmBatchService.upsert(record);
				await this.hanaBatchservice.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.BATCH, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.BATCH, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}