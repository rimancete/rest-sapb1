import { Module } from '@nestjs/common';
import { ServiceLayerSaleOrdersService } from './sale-orders.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [ServiceLayerSaleOrdersService],
  exports: [ServiceLayerSaleOrdersService]
})
 
export class ServiceLayerSaleOrdersModule {}
