export interface InventoryGenEntry {
	DocNum?: string,
	DocDate?: string,
	DocDueDate?: string,
	DocTotal?: number,
  Reference2?: string,
  U_ALFA_RequestNumber: string,
	Comments?: string,
	BPL_IDAssignedToInvoice?: number,
	DocumentLines?: InventoryGenEntryLines[]
	DocObjectCode?: string
}

export interface InventoryGenEntryLines {
	ItemCode?: string,
	Quantity?: number,
	Price?: number,
	AccountCode?: string,
	LineTotal?: number,
	CostingCode?: string,
  WarehouseCode?: string,
	ProjectCode?: string,
  U_ALFA_TPCC?: string,
  U_ALFA_NomeComprador?: string,
	U_ALFA_Comprador?: number,
	U_ALFA_SaldoSaida?: number,
	U_ALFA_GATECId?: string,
	U_ALFA_Remarks?: string,
	BatchNumbers?: BatchNumber[],
	UseBaseUnits?: string
}

export interface BatchNumber {
	BatchNumber?: string,
	AddmisionDate?: string,
	Quantity?: number
}