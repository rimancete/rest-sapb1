import { Module } from '@nestjs/common';
import { ItemInventoryService } from './item-inventory.service';
import { SimpleFarmItemInventoryModule } from '../../core/simple-farm/item-inventory/item-inventory.module';
import { HanaItemInventoryModule } from '../../core/b1/hana/item-inventory/item-inventory.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaItemInventoryModule, SimpleFarmItemInventoryModule, LogsModule],
	providers: [ItemInventoryService],
	exports: [ItemInventoryService],
})
export class ItemInventoryModule { }
