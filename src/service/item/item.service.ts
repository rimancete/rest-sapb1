import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SimpleFarmItemService } from '../../core/simple-farm/item/item.service';
import { HanaItemService } from '../../core/b1/hana/item/item.service'
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import { Runner } from '../../core/runner';
import { InventoryLocationService } from '../inventory-location/inventory-location.service';

@Injectable()
export class ItemService extends Runner {

	private logger = new Logger(InventoryLocationService.name);

	constructor(
		private readonly hanaItemService: HanaItemService,
		private readonly simpleFarmItemService: SimpleFarmItemService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {
		const records = await this.hanaItemService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			try {
				const responseObject = await this.simpleFarmItemService.upsert(record);
				await this.hanaItemService.setIntegrated(record);
				this.logsService.logSuccess({
					key: record.Code, module: LogModule.ITEM, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key: record.Code, module: LogModule.ITEM, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}

	}
}