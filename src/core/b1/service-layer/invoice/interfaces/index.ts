import * as _ from 'lodash';

export interface Invoice {
	DocEntry?: string,
	DocNum?: string,
	DocDate?: string,
	CardCode?: string,
	DocDueDate?: string,
	DocTotal?: number,
	RequriedDate?: string,
	Reference2?: string,
	Requester?: string,
	Reqtype?: string,
	Comments?: string,
	DocObjectCode?: string,
	RequesterEmail?: string,
	U_ALFA_RequestNumber?: string,
	BPL_IDAssignedToInvoice?: number,
	BaseEntry?: string,
  SequenceSerial?: string,
  U_ChaveAcesso?: string,
  U_ALFA_VencimentoNF: string,
  DocumentLines?: InvoiceLine[],
  ClosingRemarks?: string,
  TaxExtension?: any
}

export interface InvoiceLine {
  BaseLine?: number,
  BaseEntry?: number,
  BaseType?: number,
	ItemCode?: string,
	Quantity?: number,
	WarehouseCode?: string,
	CostingCode?: string,
	AccountCode?: string,
  TaxCode?: string,
  Usage?: string
}
