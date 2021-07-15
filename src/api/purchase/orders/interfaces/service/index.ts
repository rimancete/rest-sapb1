/* eslint-disable @typescript-eslint/camelcase */
import { PurchaseOrdersRequest, PurchaseOrdersData } from "../controller";
import { PurchaseOrders } from "../../../../../core/b1/service-layer/purchase-orders/interfaces";

const From = (request: PurchaseOrdersRequest): PurchaseOrders => {

	const entity: PurchaseOrders = {
		Comments: request.remarks,
		DocDate: request.documentDate,
		DocDueDate: request.documentDueDate,
		RequesterEmail: "insolo@insolo.com.br",
		U_ALFA_RequestNumber: request.reference,
    	CardCode: request.partnerCode,
		U_ALFA_Filial: request.businessPlaceCode, 
    	// DocObjectCode: "oPurchaseOrders",
		BPL_IDAssignedToInvoice: request.businessPlaceCode, //9
		DocumentLines: request.items.map(item => {
			return {				
				CostingCode: item.costCenterCode,
				ItemCode: item.itemCode,
        Quantity: item.quantity,
        NumPerMsr: 1,
				// WarehouseCode: item.warehouseCode,
        UnitPrice: item.price,
        BaseEntry: item.BaseEntry,
        BaseLine: item.BaseLine,
		U_ALFA_Filial: request.businessPlaceCode,
        BaseType: 540000006
			}
		})
	};

	return entity;

}

const To = (result: PurchaseOrders): PurchaseOrdersData => {

	const entity: PurchaseOrdersData = {
		requestCode: result.DocNum,
		items: result.DocumentLines.map(item => {
			return {
				itemCode: item.ItemCode,
				accountCode: item.AccountCode
			}
		})
	};

	return entity;

}

export const Mapper = {
	From,
	To
}