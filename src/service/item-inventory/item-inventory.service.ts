import { Injectable, Logger } from '@nestjs/common';
import * as _ from 'lodash';
import { HanaItemInventoryService } from '../../core/b1/hana/item-inventory/item-inventory.service';
import { SimpleFarmItemInventoryService } from '../..//core/simple-farm/item-inventory/item-inventory.service';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';

@Injectable()
export class ItemInventoryService extends Runner {

  private logger = new Logger(ItemInventoryService.name);

  constructor(
    private readonly hanaItemInventoryService: HanaItemInventoryService,
    private readonly simpleFarmItemInventoryService: SimpleFarmItemInventoryService,
    private readonly logsService: LogsService
  ) {
    super();
  }

  async proccess() {
    const records = await this.hanaItemInventoryService.getNotIntegrated();

    if (records.length > 0) {
      this.logger.log(`Found ${records.length} records to integrate...`)
    }

    for (const record of records) {
      const key = `${record.ItemCode}|${record.InventoryLocationCode}`;
      try {
        const responseObject = await this.simpleFarmItemInventoryService.upsert(record);
        await this.hanaItemInventoryService.setIntegrated(record);
        this.logsService.logSuccess({
          key,
          module: LogModule.ITEM_INVENTORY,
          requestObject: record,
          responseObject
        });
      }
      catch (exception) {
        this.logsService.logError({ key, module: LogModule.ITEM_INVENTORY, exception });
      }
    }

    if (records.length > 0) {
      this.logger.log(`Finished integration...`)
    }

  }
}