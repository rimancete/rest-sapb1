export interface Transaction {
	Code: string,
	Description: string,
	ShortName: string,
	ParentCode?: string,
	TransactionType: number,
	Active?: boolean
} 