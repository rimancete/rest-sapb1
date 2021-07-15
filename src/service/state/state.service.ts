import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmStateService } from '../../core/simple-farm/state/state.service';
import { HanaStateService } from '../../core/b1/hana/state/state.service'
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';
import { ItemGroupService } from '../item-group/item-group.service';

@Injectable()
export class StateService extends Runner {

	private logger = new Logger(ItemGroupService.name);

	constructor(
		private readonly hanaStateService: HanaStateService,
		private readonly simpleFarmStateService: SimpleFarmStateService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		const records = await this.hanaStateService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
				const responseObject = await this.simpleFarmStateService.upsert(record);
				await this.hanaStateService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.STATE, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.STATE, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}

}