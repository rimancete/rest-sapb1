/* eslint-disable @typescript-eslint/camelcase */
import { PurchaseRequestRequest, PurchaseRequestData } from "../controller";
import { PurchaseRequest } from "../../../../../core/b1/service-layer/purchase-requests/interfaces";

const From = (request: PurchaseRequestRequest): PurchaseRequest => {

	const entity: PurchaseRequest = {
    Comments: request.remarks,
		DocDate: request.requestDate,
		DocDueDate: request.requestDate,
		RequriedDate: request.requestDate,
		DocObjectCode: 'oPurchaseRequest',   
    Reqtype: "12",
    Requester: request.requester,
		RequesterEmail: "insolo@insolo.com.br",
    U_ALFA_RequestNumber: request.reference,
    U_ALFA_TIPO_DE_COMPRA: request.type,
    U_ALFA_Integration_Step: 1,
		U_ALFA_Filial: request.businessPlaceCode,
    U_ALFA_NivelCriticidade: 3,
    AuthorizationStatus: "dasPending",
		DocumentLines: request.items.map(item => {
			return {
        U_ALFA_ORIGINAL_STOCK: item.warehouseCode,
				CostingCode: item.costCenterCode,
				ItemCode: item.itemCode,
        Quantity: item.quantity,
        NumPerMsr: 1,
				UseBaseUnits:'tYES',
				U_ALFA_GATECId: item.reference, 
				U_ALFA_Remarks: item.remarks,
				U_ALFA_Filial: request.businessPlaceCode,
				U_ALFA_Comprador: item.buyerCode,
				U_ALFA_NomeComprador: item.buyerName
			}
		})
	};
	
	return entity;

}

const To = (result: PurchaseRequest): PurchaseRequestData => {

	const entity: PurchaseRequestData = {
		requestCode: result.DocNum,
		items: result.DocumentLines.map(item => {
			return {
				requestCode: item.U_ALFA_GATECId,
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