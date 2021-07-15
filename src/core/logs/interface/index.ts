export enum LogModule {
	HARVEST = 1,
	COMPANY = 2,
	COST_CENTER = 3,
	HARVEST_MATERIAL = 4,
	COUNTRY = 5,
	CURRENCY = 6,
	INVENTORY_LOCATION = 7,
	MATRIX_DISTRIBUITION = 8,
	ITEM = 9,
	ITEM_FAMILY = 10,
	ITEM_GROUP = 11,
	PURCHASE_REQUEST = 12,
	STOCK_MOVEMENT = 13,
	STATE = 14,
	SUPLIER_CLIENT = 15,
	UNIT_MEASUREMENT = 16,
	STOCK_TRANSFER_REQUEST = 17,
	BRANCH = 18,
	CITY = 19,
	CURRENCY_CATEGORY = 23, //MANTER IGUAL DO BANCO DE DADOS
	CURRENCY_QUOTE = 24,
	ITEM_INVENTORY = 25,
	ITEM_PRICE = 26,
	PROJECTS = 27,
	STOCK_REVALUATION = 28,
	PURCHASE_ORDER = 29,
	CONTRACT = 30,
	BATCH = 31,
	SITUATION_HISTORY = 32,
	PAYMENT_CONDITION = 33,
	SALE_ORDER = 34,
	INVOICE = 36,
  DOWN_PAYMENT = 35,
  TRANSACTION = 42,
  DRAFTINVOICE = 45
}

export enum LogType {
	ERROR = 1,
	SUCCESS = 2,
	INFORMATION = 3,
	BUSINESS = 4
}

export interface Log {
	LOGTYPECODE: LogType;
	MODULE: LogModule;
	MESSAGE: string;
	FULLMESSAGE: string;
	KEY: string;
	REQUESTOBJECT: any;
	RESPONSEOBJECT: any;
}


export interface LogSuccessRequest {
	key: string,
	message?: string,
	module: LogModule,
	requestObject: any,
	responseObject: any
}

export interface LogErrorRequest {
	key: string,
	module: LogModule,
	exception: any
}

