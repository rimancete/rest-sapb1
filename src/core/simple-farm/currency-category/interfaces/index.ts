export interface CurrencyCategory {
	Code: string,
	Description: string,
	ShortName: string,
	ForStock?: boolean,
	Currencies?: CurrencyCategorySymbol[]
}

export interface CurrencyCategorySymbol {
	Symbol?: string
}