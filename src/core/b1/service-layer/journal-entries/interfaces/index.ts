import * as _ from 'lodash';

export interface JournalEntryDocument {
  Number?: string,
  ProjectCode?: string,
  TaxDate?: string,
  DueDate?: Date,
  ReferenceDate?: string,
  Reference?: string,
  Memo?: string,
  JournalEntryLines?: JournalEntryDocumentLines[],
}

export interface JournalEntryDocumentLines {
  BPLID?: string,
  AccountCode?: string,
  Debit?: number,
  Credit?: number,
  LineMemo?: string,
  CostingCode?: string,
  TaxDate?: string,
  DueDate?: string,
  ReferenceDate1?: string,
  ProjectCode?: string
}
