import * as _ from 'lodash';

export interface InventoryTransferRequest {
	DocNum?: string,
	DocDate?: string,
	Reference2?: string,
	Comments?: string,
	DocObjectCode?: string,
	BPLID?: number,
	FromWarehouse?: string,
  ToWarehouse?: string,
  U_ALFA_RequestNumber: string,
	StockTransferLines?: InventoryTransferRequestLine[]
}

export interface InventoryTransferRequestLine {
	ItemCode?: string,
	Quantity?: number,
	WarehouseCode?: string,
	FromWarehouseCode?: string
}
