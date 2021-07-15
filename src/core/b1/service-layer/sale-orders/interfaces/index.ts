export interface Document {
    DocEntry?: number,
    DocNum?: string,
    NumAtCard?: string,
    CardCode?: string,
    CardName?: string,
    DocDate?: string,
    DocDueDate?: string,
    TaxDate?: string,
    BPLId?: number,
    BPL_IDAssignedToInvoice?: number,
    Reference2?: string,
    RequesterEmail?: string,
    U_ALFA_RequestNumber?: string,
    DocObjectCode?: string,
    InterimType?: string,
    RelatedType?: string,
    SalesPersonCode?: string,
    DownPaymentType?: string,
    U_ALFA_NUM_PED_QD?: string,
    OpeningRemarks?: string,
    Comments?: string,
    DocStatus?: string,
    TrnspCode?: string,
    PaymentMethod?: string,
    PaymentGroupCode?: string,
    ClosingRemarks?: string,
    Address2?: string,
    Address?: string,
    TaxExtension?: TaxExtension,
    DocumentAdditionalExpenses?: DocumentAdditionalExpenses[],
    DocumentLines?: DocumentLine[],
    U_SKILL_FormaPagto?: string,
    U_ALFA_NumSite?: string,
    U_ALFA_ThundersInvoiceId?: string,
    U_ALFA_ThundersOrderId?: string,
    U_ALFA_OperationTypeDescription?: string,
    U_EmailEnvDanfe?: string,
}

export interface DocumentAdditionalExpenses {
    ExpenseCode?: number,
    LineTotal?: number
}

export interface TaxExtension {
    TaxId0?: string,
    TaxId1?: string,
    TaxId4?: string,
    Incoterms?: string,
    U_EmailEnvDanfe?: string,
    U_ALFA_OperationTypeDescription?: string
}



export interface SaleOrderModel {
  Action?: string,
  DocEntry?: string,
  DocNum?: string,
  CardCode?: string,
  NumAtCard?: string,
  DocDate?: string,
  DocDueDate?: string,
  TaxDate?: string,
  SalesPersonCode?: string,
  Comments?: string,
  DocObjectCode?: string,
  InterimType?: string,
  RelatedType?: string,
  DownPaymentType?: string,
  Reference2?: string,
  RequesterEmail?: string,
  U_ALFA_RequestNumber?: string,
  U_ALFA_ContractNumber?: string,
  U_ALFA_pedidoId?:string,
  BPL_IDAssignedToInvoice?: number,
  PaymentGroupCode?: string,
  DocumentLines?: DocumentLine[]
}

export interface DocumentLine {
  LineNum?: string,
  BaseLine?: string,
  ItemCode?: string,
  Usage?: string,
  Quantity?: number,
  UnitPrice?: number,
  CostingCode?: string,
  WarehouseCode?: string,
  LineTotal?: string,
  AccountCode?: string,
  UoMEntry?: string,
  UoMCode?: string
}

export interface saleOrder {
  ScarnioId?: string,
  SubsidiaryCnpj?: string,
  DocEntry?: string,
  BPL_IDAssignedToInvoice?: string,
  CardCode?: string,
  NumAtCard?: string,
  DocDate?: Date,
  DocDueDate?: Date,
  TaxDate?: Date,
  U_JMS_IdPedido?: string,
  U_JMS_Tipo_Pedido?: string,
  DocumentLines?: DocumentLine[],
  TaxExtensions?: TaxExtension[]
}




