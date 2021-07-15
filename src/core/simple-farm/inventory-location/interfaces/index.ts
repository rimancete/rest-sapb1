export interface InventoryLocation {
	CompanyCode: string,
	CompanySubsidiaries: CompanySubsidiaryCode[],
	Code: string,
	ShortName: string,
	Description: string,
	Ownership?: number,
	Active: boolean
}

export interface CompanySubsidiaryCode {
	CompanySubsidiaryCode: string
}
