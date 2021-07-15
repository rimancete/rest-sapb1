/* eslint-disable @typescript-eslint/camelcase */
import { InvoiceData, InvoiceRequest } from "../controller";
import { HanaSale } from '../../../../../core/b1/hana/sale/interface'
import { Invoice } from "../../../../../core/b1/service-layer/invoice/interfaces";
import * as _ from 'lodash';

const From = (request: HanaSale[], invoice: InvoiceRequest): Invoice => {

  const entity: Invoice = {
    BPL_IDAssignedToInvoice: _.first(request).BPLId,
    // Comments: `${invoice.comments} - ${_.first(request).Comments}`.substr(0, 250),
    DocDate: invoice.documentDate,
    DocDueDate: invoice.DtVncNF,
    Reference2: _.first(request).Ref2,
    CardCode: _.first(request).CardCode,
    U_ALFA_RequestNumber: invoice.invoiceNumber,
    U_ALFA_VencimentoNF: invoice.DtVncNF,
    // ClosingRemarks: _.first(request).Comments,
    ClosingRemarks: invoice.comments,
    TaxExtension: {
      NetWeight: invoice.netWeight,
      GrossWeight: invoice.grossWeight,
      Vehicle: invoice.vehicle,
      VehicleState: invoice.vidState,
      Incoterms: invoice.freightType,
      Carrier: invoice.carrier,
    }
  }

  return entity;

};

const To = (result: Invoice): InvoiceData => {

  const entity: InvoiceData = {
    invoiceId: result.DocEntry,
    invoiceNum: result.DocNum,
    invoiceSeq: result.SequenceSerial
  };

  return entity;

}

export const Mapper = {
  From,
  To
}
