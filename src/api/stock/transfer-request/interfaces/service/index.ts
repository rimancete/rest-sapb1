import { StockTransferRequestRequest, StockTransferRequestData } from "../controller";
import { InventoryTransferRequest } from "../../../../../core/b1/service-layer/inventory-transfer-requests/interfaces";
import { InventoryGenEntry, InventoryGenEntryLines } from "../../../../../core/b1/service-layer/inventory-gen-entries/interfaces";
import * as _ from 'lodash';

const From = (request: StockTransferRequestRequest): InventoryTransferRequest => {

  const entity: InventoryTransferRequest = {
    BPLID: request.businessPlaceCode,
    Comments: request.remarks,
    DocDate: request.requestDate,
    U_ALFA_RequestNumber: request.reference,
    FromWarehouse: _.first(request.items).warehouseCode,
    ToWarehouse: _.first(request.items).toWarehouseCode,
    // DocObjectCode: "67",
    StockTransferLines: request.items.map(item => {
      return {
        ItemCode: item.itemCode,
        Quantity: item.quantity,
        FromWarehouseCode: item.warehouseCode,
        WarehouseCode: item.toWarehouseCode,
        UseBaseUnits: "tYES",
       // CostingCode: item.costCenterCode,
        U_ALFA_NomeComprador: "manager",
        U_ALFA_Comprador: 1,
        U_ALFA_GATECId: item.reference,
        U_ALFA_Remarks: item.remarks,
        U_ALFA_SaldoSaida: Math.round(item.quantity)
      }
    })
  };

  return entity;

}


const FromDevolution = (request: StockTransferRequestRequest): InventoryGenEntry => {

  const entity: InventoryGenEntry = {
    Comments: request.remarks,
    DocDate: request.requestDate,
    DocDueDate: request.requestDate,
    U_ALFA_RequestNumber: request.reference,
    BPL_IDAssignedToInvoice: request.businessPlaceCode,    
    DocObjectCode: "oInventoryGenEntry",
    DocumentLines: request.items.map(item => {
      const line: InventoryGenEntryLines = {
        ItemCode: item.itemCode,
        Quantity: item.quantity,
        CostingCode: item.costCenterCode,
        WarehouseCode: item.warehouseCode,
        UseBaseUnits: "tYES",
        U_ALFA_NomeComprador: 'manager',
        U_ALFA_Comprador: 1,
        U_ALFA_GATECId: item.reference,
        U_ALFA_Remarks: item.remarks,
        U_ALFA_SaldoSaida: item.quantity
      };
      return line;
    })
  };

  return entity;

}


const To = (result: any): StockTransferRequestData => {

  const entity: StockTransferRequestData = {
    requestCode: result.DocNum
  };

  if (result.StockTransferLines) {
    entity.items = result.StockTransferLines.map(item => {
      return {
        requestCode: item.U_ALFA_GATECId,
        itemCode: item.ItemCode
      }
    });
  }

  if (result.DocumentLines) {
    entity.items = result.DocumentLines.map(item => {
      return {
        requestCode: item.U_ALFA_GATECId,
        itemCode: item.ItemCode,
        accountCode: item.AccountCode,
        total: item.LineTotal,
      }
    });
  }

  return entity;

}

export const Mapper = {
  From,
  FromDevolution,
  To
}