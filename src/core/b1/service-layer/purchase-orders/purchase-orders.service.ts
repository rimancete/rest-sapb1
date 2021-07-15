import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { PurchaseOrders } from './interfaces';

@Injectable()
export class ServiceLayerPurchaseOrdersService extends ODataService<PurchaseOrders> {

	constructor() {
		super();
		this.path = "PurchaseOrders";
	}

}
