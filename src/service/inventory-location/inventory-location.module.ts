import { Module } from '@nestjs/common';
import { InventoryLocationService } from './inventory-location.service';
import { SimpleFarmInventoryLocationModule } from '../../core/simple-farm/inventory-location/inventory-location.module';
import { HanaInventoryLocationModule } from '../../core/b1/hana/inventory-location/inventory-location.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaInventoryLocationModule, SimpleFarmInventoryLocationModule, LogsModule],
	providers: [InventoryLocationService],
	exports: [InventoryLocationService],
})
export class InvetoryLocationModule { }
