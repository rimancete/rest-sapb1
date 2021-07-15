import { Injectable, Logger } from '@nestjs/common';
import { SimpleFarmMovementStockPurchaseService } from '../../core/simple-farm/movement-stock-purchase/movement-stock-purchase.service';
import { HanaMovementStockPurchaseService } from '../../core/b1/hana/movement-stock-purchase/movement-stock-purchase.service';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Runner } from '../../core/runner';
import { ItemGroupService } from '../item-group/item-group.service';

@Injectable()
export class MovementStockPurchaseService extends Runner {

	private logger = new Logger(ItemGroupService.name);

	constructor(
		private readonly hanaMovementStockPurchaseService: HanaMovementStockPurchaseService,
		private readonly simpleFarmMovementStockPurchaseService: SimpleFarmMovementStockPurchaseService,
		private readonly logsService: LogsService
	) {
		super();
	}

	async proccess() {

		const records = await this.hanaMovementStockPurchaseService.getNotIntegrated();

		if (records.length > 0) {
			this.logger.log(`Found ${records.length} records to integrate...`)
		}

		for (const record of records) {
			const key = `${record["ItemCode"]}|${record["PriceDate"]}|${record["InventoryLocationCode"]}`;
			try {

				record["PriceDate"] = moment(record["PriceDate"], 'YYYY-MM-DD').format('YYYY-MM-DD')
				record["Price"] = [{ CurrencyIso: 986, Value: parseFloat(record["Price"]) }];

				const responseObject = await this.simpleFarmMovementStockPurchaseService.upsert(record);
				await this.hanaMovementStockPurchaseService.setIntegrated(record["ItemCode"], record["PriceDate"], record["InventoryLocationCode"]);
				this.logsService.logSuccess({
					key, module: LogModule.ITEM_PRICE, requestObject: record, responseObject
				});
			}
			catch (exception) {
				this.logsService.logError({ key, module: LogModule.ITEM_PRICE, exception });
			}
		}

		if (records.length > 0) {
			this.logger.log(`Finished integration...`)
		}


	}
}