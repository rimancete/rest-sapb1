import { Module } from '@nestjs/common';
import { StockMovementService } from './stock-movement.service';
import { StockMovementController } from './stock-movement.controller';
import { InventoryGenEntriesModule } from '../../../core/b1/service-layer/inventory-gen-entries/inventory-gen-entries.module';
import { ServiceLayerStockTransfersModule } from '../../../core/b1/service-layer/stock-transfers/stock-transfers.module';
import { HanaBusinessPartnersModule } from '../../../core/b1/hana/business-partners/business-partners.module';
import { HanaCostCenterModule } from '../../../core/b1/hana/cost-center/cost-center.module';
import { HanaInventoryLocationModule } from '../../../core/b1/hana/inventory-location/inventory-location.module'
import { HanaUnitMeasurementModule } from '../../../core/b1/hana/unit-measurement/unit-measurement.module';
import { HanaItemModule } from '../../../core/b1/hana/item/item.module';
import { LogsModule } from '../../../core/logs/logs.module';

@Module({
	imports: [ServiceLayerStockTransfersModule, LogsModule, InventoryGenEntriesModule, HanaBusinessPartnersModule, HanaCostCenterModule, HanaInventoryLocationModule, HanaUnitMeasurementModule, HanaItemModule],
	providers: [StockMovementService],
	controllers: [StockMovementController]
})
export class StockMovementModule { }
