import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { InventoryTransferRequest } from './interfaces';

@Injectable()
export class ServiceLayerStockTransfersService extends ODataService<InventoryTransferRequest> {

	constructor() {
		super();
		this.path = "StockTransfers";
	}

}
