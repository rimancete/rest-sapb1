import { Injectable, Logger } from '@nestjs/common';
// import { Mapper } from './interfaces/service';
import { AdditionalInvoiceRequest, AdditionalInvoiceResult } from './interfaces/controller';
// import { HanaSaleService } from '../../../core/b1/hana/sale/sale.service';
// import { LogsService } from '../../../core/logs/logs.service';
// import { LogModule } from '../../../core/logs/interface';
// import { Exception } from '../../../core/exception';
// import { ServiceLayerInvoiceService } from 'src/core/b1/service-layer/invoice/invoice.service';
// import { Invoice, InvoiceLine } from '../../../core/b1/service-layer/invoice/interfaces';
// import { HanaItemService } from '../../../core/b1/hana/item/item.service';
// import { HanaWareHouseService } from '../../../core/b1/hana/warehouse/warehouse.service'

@Injectable()
export class AdditionalInvoiceService {

	private logger = new Logger(AdditionalInvoiceService.name);

	constructor(
		// private readonly serviceLayerInvoiceService: ServiceLayerInvoiceService,
		// private readonly hanaSaleService: HanaSaleService,
		// private readonly hanaItemService: HanaItemService,
		// private readonly hanaWareHouseService: HanaWareHouseService,
		// private readonly logsService: LogsService
	) { }

	async insertOrUpdate(token: string, additionalInvoiceRequest: AdditionalInvoiceRequest): Promise<any> {
		// 		try {
		// 			console.log('request', invoiceRequest);
		// 			await this.validate(invoiceRequest);
		// 			let order = await this.getOrder(invoiceRequest);

		// 			return await this.insert(token, order, invoiceRequest);
		// 		}
		// 		catch (exception) {
		// 			await this.logsService.logError({ key: invoiceRequest.orderId, module: LogModule.INVOICE, exception });
		// 			return { data: null, error: { ...exception } };
		// 		}
		return false;
	}

	// 	async getOrder(request: InvoiceRequest): Promise<Invoice> {

	// 		let record = await this.hanaSaleService.getOrder(request.orderId);

	// 		if (record != '') {

	// 			let items = request.items.map(item => {
	// 				const items: InvoiceLine = {
	// 					ItemCode: item.itemCode,
	// 					Quantity: item.quantity,
	// 					WarehouseCode: item.warehouseCode,
	// 					TaxCode: '5101-001'
	// 				}
	// 				return items;
	// 			})

	// 			const entity = Mapper.From(record);

	// 			entity.DocumentLines = items;

	// 			return entity;

	// 		} else {
	// 			throw new Exception({ code: 'X013', message: `OrderId não existe.`, request, response: null });
	// 		}


	// 	}

	// 	async validate(request: InvoiceRequest): Promise<void> {

	// 		if (!request.orderId) {
	// 			throw new Exception({ code: 'X010', message: `OrderId não informada.`, request, response: null });
	// 		}

	// 		if (!request.documentDate) {
	// 			throw new Exception({ code: 'X011', message: `Data do documento não informada.`, request, response: null });
	// 		}

	// 		if (!request.dueDate) {
	// 			throw new Exception({ code: 'X012', message: `Data de vencimento do documento não informada.`, request, response: null });
	// 		}

	// 		for (const line of request.items) {
	// 			const wareHouse = await this.hanaWareHouseService.getWareHouse(line.warehouseCode);
	// 			if (!wareHouse) {
	// 				throw new Exception({ code: 'X007', message: `Depósito [${line.warehouseCode}] não encontrado.`, request, response: null });
	// 			}

	// 			const item = await this.hanaItemService.getItem(line.itemCode);
	// 			if (!item) {
	// 				throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não encontrado.`, request, response: null });
	// 			}
	// 		}

	// 	}

	// 	async insert(token: string, entity: Invoice, request: InvoiceRequest): Promise<InvoiceResult> {

	// 		const result = await this.serviceLayerInvoiceService.session(token).create(entity);

	// 		if (result.error) {
	// 			throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })
	// 		} else {
	// 			const response: InvoiceResult = { data: Mapper.To(result.data) }
	// 			await this.logsService.logSuccess({ key: response.data.orderId, module: LogModule.INVOICE, requestObject: request, responseObject: result });
	// 			return response;
	// 		}

	// 	}

}
