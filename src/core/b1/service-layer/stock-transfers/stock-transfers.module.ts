import { Module } from '@nestjs/common';
import { ServiceLayerStockTransfersService } from './stock-transfers.service';
import { ODataModule } from '../odata/odata.module';

@Module({
	imports: [ODataModule],
	providers: [ServiceLayerStockTransfersService],
	exports: [ServiceLayerStockTransfersService]
})

export class ServiceLayerStockTransfersModule { }
