import { Module } from '@nestjs/common';
import { ServiceLayerPurchaseOrdersService } from './purchase-orders.service';
import { ODataModule } from '../odata/odata.module';

@Module({
	imports: [ODataModule],
	providers: [ServiceLayerPurchaseOrdersService],
	exports: [ServiceLayerPurchaseOrdersService]
})

export class ServiceLayerPurchaseOrdersModule { }
