import * as _ from 'lodash';

export interface PurchaseRequest {
  
	DocNum?: string,
	DocDate?: string,
	DocDueDate?: string,
	DocTotal?: number,
	RequriedDate?: string,
	Reference2?: string,
	Requester: string,
	Reqtype: string,
	Comments?: string,
	DocObjectCode?: string,
	RequesterEmail?: string,
	BPL_IDAssignedToInvoice?: number,
	U_ALFA_RequestNumber?: string,
	U_ALFA_TIPO_DE_COMPRA: number,
	U_ALFA_Integration_Step: number,
	U_ALFA_Filial: number;
  U_ALFA_NivelCriticidade: number,
  AuthorizationStatus?: string,
	DocumentLines?: PurchaseRequestLine[]
}

export interface PurchaseRequestLine {
	ItemCode?: string,
	Quantity?: number,
	WarehouseCode?: string,
	CostingCode?: string,
	AccountCode?: string;
	Usage?: number;
	U_ALFA_ORIGINAL_STOCK?: string;
	U_ALFA_GATECId?: string,
	U_ALFA_Remarks?: string
}
