import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { Invoice } from './interfaces';

@Injectable()
export class ServiceLayerInvoiceService extends ODataService<Invoice> {

	constructor() {
		super();
		this.path = "Invoices";
	}

}
