import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { PurchaseRequest } from './interfaces';

@Injectable()
export class PurchaseRequestsService extends ODataService<PurchaseRequest> {

	constructor() {
		super();
		this.path = "PurchaseRequests";
	}

}
