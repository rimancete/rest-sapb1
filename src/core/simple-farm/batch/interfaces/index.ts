export interface Batch {
  batchCode: string, 
  itemCode: string, 
  isItemDefault: boolean,
  producingUnitCode: string,
  projectCode: string, 
  periodCode: string,
  supplierBatchCode: string, 
  productionDate: string, 
  expirationDate: string, 
  active: boolean
}