import * as _ from 'lodash';

export interface Document {
  CardCode: string,
  DocObjectCode: string,
  DocumentLines: DocumentLines[]
}

export interface DocumentLines {
  ItemCode: string,
  Quantity: string,
  TaxCode: string,
  UnitPrice: 30
}
