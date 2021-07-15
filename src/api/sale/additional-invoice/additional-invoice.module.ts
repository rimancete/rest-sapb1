import { Module } from '@nestjs/common';
import { AdditionalInvoiceService } from './additional-invoice.service';
import { AdditionalInvoiceController } from './additional-invoice.controller';
import { LogsModule } from '../../../core/logs/logs.module';
import { ServiceLayerInvoiceModule } from 'src/core/b1/service-layer/invoice/invoice.module';
import { HanaSaleModule } from 'src/core/b1/hana/sale/sale.module';
import { HanaWareHouseModule } from '../../../core/b1/hana/warehouse/warehouse.module';
import { HanaItemModule } from '../../../core/b1/hana/item/item.module'


@Module({
	imports: [ServiceLayerInvoiceModule, HanaSaleModule, HanaWareHouseModule, HanaItemModule, LogsModule],
	providers: [AdditionalInvoiceService],
	controllers: [AdditionalInvoiceController]
})
export class AdditionalInvoiceModule { }
