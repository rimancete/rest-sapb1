import * as _ from 'lodash';

export interface PurchaseOrders {
	DocNum?: string,
	DocDate?: string,
	DocDueDate?: string,
	DocTotal?: number,
	RequriedDate?: string,
	Reference2?: string,
	Comments?: string,
	DocObjectCode?: string,
	RequesterEmail?: string,
	U_ALFA_Filial: number,
	BPL_IDAssignedToInvoice?: number,
	U_ALFA_RequestNumber?: string,
	CardCode?: string,
	DocumentLines?: PurchaseOrdersLine[]
}

export interface PurchaseOrdersLine {
	ItemCode?: string,
	Quantity?: number,
	WarehouseCode?: string,
	CostingCode?: string,
	U_ALFA_Filial: number,
	AccountCode?: string
}


export interface PurchaseOrdersRequest {
	businessPlaceCode: number;
	reference?: string;
	projectCode: string;
	documentDate: string;
	documentDueDate: string;
	partnerCode: string;
	contractCode: string;
	orderType: string;
	discountValue: number;
	remarks?: string;
	items: PurchasOrdersItemRequest[]
}

export interface PurchasOrdersItemRequest {
	itemCode: string;
	quantity: number;
	price: number;
	costCenterCode?: string;
}