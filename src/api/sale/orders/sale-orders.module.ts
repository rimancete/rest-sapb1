import { Module } from '@nestjs/common';
import { SaleOrdersService } from './sale-orders.service';
import { SaleOrdersController } from './sale-orders.controller';
import { ServiceLayerSaleOrdersModule } from '../../../core/b1/service-layer/sale-orders/sale-orders.module';
import { HanaBusinessPartnersModule } from '../../../core/b1/hana/business-partners/business-partners.module';
import { HanaCostCenterModule } from '../../../core/b1/hana/cost-center/cost-center.module';
import { HanaInventoryLocationModule } from '../../../core/b1/hana/inventory-location/inventory-location.module'
import { HanaItemModule } from '../../../core/b1/hana/item/item.module';
import { LogsModule } from '../../../core/logs/logs.module';
import { HanaContractModule } from 'src/core/b1/hana/contract/contract.module';
import { HanaProjectModule } from 'src/core/b1/hana/project/project.module';
import { HanaWareHouseModule } from '../../../core/b1/hana/warehouse/warehouse.module'
import { HanaUnitMeasurementModule } from 'src/core/b1/hana/unit-measurement/unit-measurement.module';
import { HanaSaleModule } from '../../../core/b1/hana/sale/sale.module'

@Module({
  imports: [ServiceLayerSaleOrdersModule, HanaBusinessPartnersModule, HanaUnitMeasurementModule, HanaCostCenterModule, HanaInventoryLocationModule, HanaItemModule, LogsModule, HanaContractModule, HanaProjectModule, HanaWareHouseModule, HanaSaleModule],
  providers: [SaleOrdersService],
  controllers: [SaleOrdersController]
})
export class SaleOrdersModule { }
