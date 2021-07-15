import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { LogsModule } from '../../../core/logs/logs.module';
import { ServiceLayerInvoiceModule } from 'src/core/b1/service-layer/invoice/invoice.module';
import { HanaSaleModule } from 'src/core/b1/hana/sale/sale.module';
import { HanaWareHouseModule } from '../../../core/b1/hana/warehouse/warehouse.module';
import { HanaBusinessPartnersModule } from '../../../core/b1/hana/business-partners/business-partners.module';
import { HanaItemModule } from '../../../core/b1/hana/item/item.module'
import { HanaCityModule } from '../../../core/b1/hana/city/city.module'
import { DraftModule } from '../../../core/b1/service-layer/draft/draft.module';

@Module({
	imports: [DraftModule, ServiceLayerInvoiceModule, HanaSaleModule, HanaBusinessPartnersModule,  HanaWareHouseModule, HanaItemModule, LogsModule , HanaCityModule],
	providers: [InvoiceService],
	controllers: [InvoiceController]
})
export class InvoiceModule { }
