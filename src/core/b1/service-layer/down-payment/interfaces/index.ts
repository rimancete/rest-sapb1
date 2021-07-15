import * as _ from 'lodash';

export interface DownPaymentRequest {
    CardCode: string;
    DocDate: string;
    DocDueDate: string;
    TaxDate: string;
    BPL_IDAssignedToInvoice: number;
    DownPaymentType: string;
    DocumentLines: doc[];
}

export interface doc {
    BaseType: number;
    BaseEntry: string;
    UnitPrice: string;
    Quantity: string;
}
