import { Module } from '@nestjs/common';
import { PurchaseRequestService } from './purchase-request.service';
import { PurchaseRequestController } from './purchase-request.controller';
import { PurchaseRequestsModule } from '../../../core/b1/service-layer/purchase-requests/purchase-requests.module';
import { HanaBusinessPartnersModule } from '../../../core/b1/hana/business-partners/business-partners.module';
import { HanaCostCenterModule } from '../../../core/b1/hana/cost-center/cost-center.module';
import { HanaInventoryLocationModule } from '../../../core/b1/hana/inventory-location/inventory-location.module'
import { HanaItemModule } from '../../../core/b1/hana/item/item.module';
import { LogsModule } from '../../../core/logs/logs.module';
import { HanaProjectModule } from 'src/core/b1/hana/project/project.module';
import { DraftModule } from 'src/core/b1/service-layer/draft/draft.module';

@Module({
	imports: [PurchaseRequestsModule, HanaBusinessPartnersModule, HanaCostCenterModule, HanaInventoryLocationModule, HanaItemModule, HanaProjectModule, LogsModule, DraftModule],
	providers: [PurchaseRequestService],
	controllers: [PurchaseRequestController]
})
export class PurchaseRequestModule { }
