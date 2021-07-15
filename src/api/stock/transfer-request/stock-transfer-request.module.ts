import { Module } from '@nestjs/common';
import { StockTransferRequestService } from './stock-transfer-request.service'
import { StockTransferRequestController } from './stock-transfer-request.controller';
import { InventoryTransferRequestsModule } from '../../../core/b1/service-layer/inventory-transfer-requests/inventory-transfer-requests.module';
import { InventoryGenEntriesModule } from '../../../core/b1/service-layer/inventory-gen-entries/inventory-gen-entries.module';
import { HanaBusinessPartnersModule } from '../../../core/b1/hana/business-partners/business-partners.module';
import { HanaCostCenterModule } from '../../../core/b1/hana/cost-center/cost-center.module';
import { HanaInventoryLocationModule } from '../../../core/b1/hana/inventory-location/inventory-location.module'
import { HanaUnitMeasurementModule } from '../../../core/b1/hana/unit-measurement/unit-measurement.module';
import { HanaItemModule } from '../../../core/b1/hana/item/item.module';
import { LogsModule } from '../../../core/logs/logs.module';

@Module({
	imports: [LogsModule, InventoryTransferRequestsModule, InventoryGenEntriesModule, HanaBusinessPartnersModule, HanaCostCenterModule, HanaInventoryLocationModule, HanaUnitMeasurementModule, HanaItemModule],
	providers: [StockTransferRequestService],
	controllers: [StockTransferRequestController]
})
export class StockTransferRequestModule { }
