export interface ItemPrice {
	CompanyCode: string;
	SubsidiaryCode: string;
	ItemCode: string;
	PriceDate: string;
	Price: ItemPriceDetail[];
	InventoryLocationCode: string;
}

export interface ItemPriceDetail {
	CurrencyIso: string;
	Value: string;
}