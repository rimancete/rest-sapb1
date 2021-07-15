/* eslint-disable @typescript-eslint/camelcase */
import { DownPaymentRequest, DownPaymentData } from "../controller";
import { PurchaseOrders } from "../../../../../core/b1/service-layer/purchase-orders/interfaces";
import { HanaSale } from "src/core/b1/hana/sale/interface";

export class DownPayment {
  CardCode: string;
  DocEntry: string;
  BPLId: string;
}

export class Document {
  CardCode: string;
  DocDate: string;
  DocDueDate: string;
  TaxDate: string;
  BPL_IDAssignedToInvoice: number;
  DownPaymentType: string;
  DocumentLines: doc[];
}

export class doc {
  BaseType: number;
  BaseEntry: string;
  UnitPrice: string;
  Quantity: string;
  BaseLine?: number;
}

const From = (request: DownPaymentRequest, existingOrder: HanaSale, baseLine: number): Document => {

  const document: Document = {
    CardCode: existingOrder.CardCode,
    DocDate: request.documentDate,
    DocDueDate: request.dueDate,
    TaxDate: request.documentDate,
    BPL_IDAssignedToInvoice: existingOrder.BPLId,
    DownPaymentType: "dptInvoice",
    DocumentLines: [
      {
        BaseType: 17,
        BaseEntry: existingOrder.DocEntry,
        BaseLine: baseLine,
        UnitPrice: request.unitPrice,
        Quantity: request.quantity
      }
    ]
  }
  return document;
}

const To = (result: any): DownPaymentData => {

  const entity: DownPaymentData = {
    DocEntry: result.DocEntry,
    DocNum: result.DocNum
  };

  return entity;

}

export const Mapper = {
  From,
  To
}