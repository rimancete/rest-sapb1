import { Module } from '@nestjs/common';
import { InventoryTransferRequestsService } from './inventory-transfer-requests.service'
import { ODataModule } from '../odata/odata.module';

@Module({
	imports: [ODataModule],
	providers: [InventoryTransferRequestsService],
	exports: [InventoryTransferRequestsService]
})

export class InventoryTransferRequestsModule { }
