export interface Contract {
	Code: string,
	CompanyCode: number,
	StartDate: Date,
	EndDate: Date, 
	Status: number,
	ProviderCode: number,
	Remark: string,
	Items: item[]
}

export interface item {
	AgricuturalOperation: number,
	PointingUnit: number,
	UnitaryValue: number
}