/* eslint-disable @typescript-eslint/camelcase */
// import { InvoiceData } from "../controller";
// import { HanaSale } from '../../../../../core/b1/hana/sale/interface'
// import { Invoice } from "../../../../../core/b1/service-layer/invoice/interfaces";
// import * as _ from 'lodash';

// const From = (request: HanaSale[]): Invoice => {

// 	const entity: Invoice = {
// 		BaseEntry: _.first(request).DocEntry,
// 		BPL_IDAssignedToInvoice: _.first(request).BPLId,
// 		Comments: _.first(request).Comments,
// 		DocDate: _.first(request).DocDate,
// 		DocDueDate: _.first(request).DocDueDate,
// 		Reference2: _.first(request).Ref2,
// 		CardCode: _.first(request).CardCode,
// 		RequesterEmail: _.first(request).Email,
// 		U_ALFA_RequestNumber: _.first(request).U_ALFA_RequestNumber
// 	}

// 	return entity;

// };

// const To = (result: Invoice): InvoiceData => {

// 	const entity: InvoiceData = {
// 		orderId: result.DocEntry,
// 		orderNum: result.DocNum
// 	};

// 	return entity;

// }

// export const Mapper = {
// 	From,
// 	To
// }