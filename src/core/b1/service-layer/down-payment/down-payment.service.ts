import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { DownPaymentRequest } from './interfaces';

@Injectable()
export class DownPaymentsRequestsService extends ODataService<DownPaymentRequest> {

	constructor() {
		super();
		this.path = "DownPayments";
	}

}
