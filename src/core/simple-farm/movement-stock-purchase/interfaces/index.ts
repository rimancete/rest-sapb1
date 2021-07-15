export interface MovementsStockPurchase {
	Id?: string;
	Type?: Type;
	CompanyCode?: string;
	SubsidiaryCode?: string;
	RequestId?: string;
	AttendanceDate?: string;
	CostCenterCode?: string;
	AccountCode?: string;
	ItemCode?: string;
	Quantity?: string;
	UnitValues?: Value;
	TotalValues?: Value;

	//PARA TIPO 1 E 2
	RequisitionNumber?: string;

	//PARA TIPO 3 E 4
	SupplierCode?: string;
	Invoice?: string;
	InvoiceSeries?: string;

	Observation?: string;
}

export interface Value {
	CurrencyIso: string;
	Value: string;
}

export enum Type {
	"Requisição" = 1,
	"Devolução" = 2,
	"Nota fiscal de compra" = 3,
	"Cancelamento de nota" = 4
}