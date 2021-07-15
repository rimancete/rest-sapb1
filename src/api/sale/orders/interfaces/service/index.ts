/* eslint-disable @typescript-eslint/camelcase */
import { SaleOrdersRequest, SaleOrdersData } from "../controller";
import { SaleOrderModel } from "../../../../../core/b1/service-layer/sale-orders/interfaces";

const From = (request: SaleOrdersRequest): SaleOrderModel => {

  const entity: SaleOrderModel = {
    BPL_IDAssignedToInvoice: request.businessPlaceCode,
    Comments: request.remarks,
    DocDate: request.documentDate,
    DocDueDate: request.documentDueDate,
    NumAtCard: request.reference,
    CardCode: request.partnerCode,
    RequesterEmail: "insolo@insolo.com.br",
    U_ALFA_RequestNumber: request.reference,
    U_ALFA_ContractNumber: request.contractNumber,
    U_ALFA_pedidoId: request.reference,
    DocumentLines: request.items.map(item => {
      return {
        CostingCode: item.costCenterCode,
        ItemCode: item.itemCode,
        Quantity: item.quantity,
        Price: item.price,
        UnitPrice: item.price,
        UoMEntry: item.measureUnitId,
        WarehouseCode: item.warehouseCode,
        UseBaseUnits: parseInt(item.measureUnitId)==33 ? 'tNo':'tYES'
      }
    })
  };

  return entity;

}

const To = (result: SaleOrderModel): SaleOrdersData => {

  const entity: SaleOrdersData = {
    orderId: result.DocEntry,
    orderNum: result.DocNum
  };

  return entity;

}

export const Mapper = {
  From,
  To
}