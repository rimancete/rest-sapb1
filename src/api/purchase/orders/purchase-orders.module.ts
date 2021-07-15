import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { PurchaseOrdersController } from './purchase-orders.controller';
import { ServiceLayerPurchaseOrdersModule } from '../../../core/b1/service-layer/purchase-orders/purchase-orders.module';
import { HanaBusinessPartnersModule } from '../../../core/b1/hana/business-partners/business-partners.module';
import { HanaCostCenterModule } from '../../../core/b1/hana/cost-center/cost-center.module';
import { HanaInventoryLocationModule } from '../../../core/b1/hana/inventory-location/inventory-location.module'
import { HanaItemModule } from '../../../core/b1/hana/item/item.module';
import { LogsModule } from '../../../core/logs/logs.module';
import { HanaContractModule } from '../../../core/b1/hana/contract/contract.module';
import { HanaProjectModule } from '../../../core/b1/hana/project/project.module';
import { DraftModule } from '../../../core/b1/service-layer/draft/draft.module';

@Module({
  imports: [DraftModule, ServiceLayerPurchaseOrdersModule, HanaBusinessPartnersModule, HanaCostCenterModule, HanaInventoryLocationModule, HanaItemModule, LogsModule, HanaContractModule, HanaProjectModule],
  providers: [PurchaseOrdersService],
  controllers: [PurchaseOrdersController]
})
export class PurchaseOrdersModule { }
