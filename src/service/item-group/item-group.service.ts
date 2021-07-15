import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SimpleFarmItemGroupService } from '../../core/simple-farm/item-group/item-group.service';
import { HanaItemGroupService } from '../../core/b1/hana/item-group/item-group.service';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';

@Injectable()
export class ItemGroupService extends Runner {

	private logger = new Logger(ItemGroupService.name);

	constructor(
		private readonly simpleFarmItemGroupService: SimpleFarmItemGroupService,
		private readonly hanaItemGroupService: HanaItemGroupService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {
		const records = await this.hanaItemGroupService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
        
				const responseObject = await this.simpleFarmItemGroupService.upsert(record);
				await this.hanaItemGroupService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.ITEM_GROUP, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.ITEM_GROUP, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}
}