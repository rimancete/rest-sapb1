// import { Injectable, Logger } from '@nestjs/common';
// import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
// import { SimpleFarmSupplierClientAddressService } from '../../core/simple-farm/supplier-client-address/supplier-client-address.service';
// import { HanaBusinessPartnersService } from '../../core/b1/hana/business-partners/business-partners.service'
// import { LogsService } from '../../core/logs/logs.service';
// import { LogModule } from '../../core/logs/interface';
// import * as _ from 'lodash';

// @Injectable()
// export class GatecSupplierClientAdressService {
// 	constructor(
// 		private readonly hanaBusinessPartnersService: HanaBusinessPartnersService,
// 		private readonly supplierClientAddressService: SimpleFarmSupplierClientAddressService
// 	) { }

// 	private readonly logger = new Logger(GatecSupplierClientAdressService.name);

// 	async createOrUpdate() {

// 		this.logger.log('Starting Supplier-Client-Adress Integration...');

// 		const { data, error } = await this.hanaBusinessPartnersService.getNotIntegrated();

// 		console.log(JSON.stringify(data));

// 		console.log("Erro: \n" + error);

// 		if (!error && data) {

// 			// const { data: a, error: e } = await this.supplierClientAddressService.upsert(data);
// 			// console.log(a);
// 			// console.log("------------");
// 			// console.log(e);
// 			// await this.hanaBusinessPartnersService.setIntegrated("Y", "OCRD");
// 		}

// 		return true;

// 	}

// }