/* eslint-disable @typescript-eslint/camelcase */
import { StockMovementRequest, StockMovementData } from "../controller";
import { InventoryGenEntry } from "../../../../../core/b1/service-layer/inventory-gen-entries/interfaces";
import { InventoryTransferRequest } from "../../../../../core/b1/service-layer/stock-transfers/interfaces";
import { InventoryGenEntryLines } from "../../../../../core/b1/service-layer/inventory-gen-entries/interfaces";
import { InventoryTransferRequestLine } from "../../../../../core/b1/service-layer/stock-transfers/interfaces";
import * as _ from 'lodash';
import { result } from "lodash";

const From = (request: StockMovementRequest): InventoryGenEntry => {

  const entity: InventoryGenEntry = {
    Comments: request.remarks,
    DocDate: request.movementDate,
    DocDueDate: request.movementDate,
    U_ALFA_RequestNumber: request.reference,
    BPL_IDAssignedToInvoice: request.businessPlaceCode,
    DocumentLines: request.items.map(item => {

      const line: InventoryGenEntryLines = {
        ItemCode: item.itemCode,
        Quantity: item.quantity,
        CostingCode: item.costCenterCode,
        WarehouseCode: item.warehouseCode,
        ProjectCode: item.projectCode,
        Price: item.price,
        U_ALFA_TPCC: item.costCenterType
      };

      if (item.batchNumbers) {
        line.BatchNumbers = item.batchNumbers.map(batch => {
          return {
            AddmisionDate: request.movementDate,
            BatchNumber: batch.batchNumber,
            Quantity: batch.quantity
          };
        })
      }

      return line;

    })
  };

  return entity;

}

const FromTransfer = (request: StockMovementRequest): InventoryTransferRequest => {

  const entity: InventoryTransferRequest = {
    Comments: request.remarks,
    DocDate: request.movementDate,
    Reference2: request.reference,
    BPLID: request.businessPlaceCode,
    FromWarehouse: _.first(request.items).fromWarehouseCode,
    ToWarehouse: _.first(request.items).warehouseCode,
    StockTransferLines: request.items.map(item => {

      const line: InventoryTransferRequestLine = {
        ItemCode: item.itemCode,
        Quantity: item.quantity,
        WarehouseCode: item.warehouseCode,
        FromWarehouseCode: item.fromWarehouseCode
      }

      if (item.batchNumbers) {
        line.BatchNumbers = item.batchNumbers.map(batch => {
          return {
            AddmisionDate: request.movementDate,
            BatchNumber: batch.batchNumber,
            Quantity: batch.quantity
          };
        })
      }

      return line;

    })
  };

  return entity;

}

const To = (result: InventoryGenEntry): StockMovementData => {

  const entity: StockMovementData = {
    movementCode: result.DocNum,
    movementValue: _.sumBy(result.DocumentLines, l => { return l.Price * l.Quantity }),
    items: result.DocumentLines.map(item => {
      return {
        itemCode: item.ItemCode,
        accountCode: item.AccountCode,
        unitPrice: item.Price,
        total: item.Price * item.Quantity,
      }
    })
  };

  return entity;

}

const ToTransfer = (result: InventoryTransferRequest): StockMovementData => {

  const entity: StockMovementData = {
    movementCode: result.DocNum,
    items: result.StockTransferLines.map(item => {
      return {
        itemCode: item.ItemCode
      }
    })
  };

  return entity;

}

export const Mapper = {
  From,
  FromTransfer,
  To,
  ToTransfer
}