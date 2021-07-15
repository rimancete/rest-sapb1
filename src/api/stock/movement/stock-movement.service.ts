/* eslint-disable @typescript-eslint/camelcase */
import { Injectable, Logger } from '@nestjs/common';
import { InventoryGenEntriesService } from '../../../core/b1/service-layer/inventory-gen-entries/inventory-gen-entries.service';
import { ServiceLayerStockTransfersService } from '../../../core/b1/service-layer/stock-transfers/stock-transfers.service';
import { HanaInventoryLocationService } from '../../../core/b1/hana/inventory-location/inventory-location.service'
import { HanaBusinessPartnersService } from '../../../core/b1/hana/business-partners/business-partners.service';
import { StockMovementResult, StockMovementRequest, MOVEMENT_TYPE } from './interfaces/controller';
import { InventoryGenEntry } from '../../../core/b1/service-layer/inventory-gen-entries/interfaces';
import { HanaCostCenterService } from '../../../core/b1/hana/cost-center/cost-center.service';
import { HanaItemService } from '../../../core/b1/hana/item/item.service';
import { LogsService } from '../../../core/logs/logs.service';
import { Exception } from '../../../core/exception';
import { LogModule } from '../../../core/logs/interface';
import { Mapper } from './interfaces/service';
import * as _ from 'lodash';
import { ODataResponse } from '../../../core/b1/service-layer/odata/interfaces';

@Injectable()
export class StockMovementService {

  private logger = new Logger(StockMovementService.name);

  constructor(
    private readonly inventoryGenEntryService: InventoryGenEntriesService,
    private readonly serviceLayerStockTransfersService: ServiceLayerStockTransfersService,
    private readonly hanaBusinessPartnersService: HanaBusinessPartnersService,
    private readonly hanaCostCenterService: HanaCostCenterService,
    private readonly hanaInventoryLocationService: HanaInventoryLocationService,
    private readonly hanaItemService: HanaItemService,
    private readonly logsService: LogsService) { }

  async insertMovement(token: string, movementRequest: StockMovementRequest): Promise<StockMovementResult> {
    console.log('movementRequest:' , movementRequest);
    try {
      await this.validate(movementRequest);
      switch (movementRequest.movementType) {
        case MOVEMENT_TYPE.ENTRY: {
          return await this.insertEntry(token, movementRequest);
        }
        case MOVEMENT_TYPE.EXIT: {
          return await this.insertExit(token, movementRequest);
        }
        case MOVEMENT_TYPE.TRANSFER: {
          return await this.insertTransfer(token, movementRequest);
        }
      }
    }
    catch (exception) {
      this.logsService.logError({ key: movementRequest.reference, module: LogModule.STOCK_MOVEMENT, exception: { ...exception, request: movementRequest } });
      return { data: null, error: { ...exception } };
    }
  }


  async insertEntry(token: string, movementRequest: StockMovementRequest): Promise<StockMovementResult> {

    const entity = Mapper.From(movementRequest);

    this.inventoryGenEntryService.setTypeEntry();
    let result: ODataResponse<InventoryGenEntry> =  await this.inventoryGenEntryService.session(token).create(entity);

    if (result.error) {
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: movementRequest })
    } else {
      for (let line of result.data.DocumentLines) {
        const cost = await this.hanaItemService.getItemCost(line.ItemCode, line.WarehouseCode);
        line.Price = cost['AvgPrice']; 
      }
      const response: StockMovementResult = { data: Mapper.To(result.data) }
      await this.logsService.logSuccess({ key: response.data.movementCode, module: LogModule.STOCK_MOVEMENT, requestObject: movementRequest, responseObject: result });
      return response;
    }

  }

  async insertExit(token: string, movementRequest: StockMovementRequest): Promise<StockMovementResult> {

    const entity = Mapper.From(movementRequest);

    this.inventoryGenEntryService.setTypeExit();

    let result: ODataResponse<InventoryGenEntry> = await this.inventoryGenEntryService.session(token).create(entity);

    if (result.error) {
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: entity })
    } else {
      for (let line of result.data.DocumentLines) {
        const cost = await this.hanaItemService.getItemCost(line.ItemCode, line.WarehouseCode);
        line.Price = parseFloat(cost['AvgPrice']); 
      }
      const response: StockMovementResult = { data: Mapper.To(result.data) }
      await this.logsService.logSuccess({ key: response.data.movementCode, module: LogModule.STOCK_MOVEMENT, requestObject: movementRequest, responseObject: result });
      return response;
    }

  }

  async insertTransfer(token: string, movementRequest: StockMovementRequest): Promise<StockMovementResult> {

    const entity = Mapper.FromTransfer(movementRequest);

    const result = await this.serviceLayerStockTransfersService.session(token).create(entity);

    if (result.error) {
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: movementRequest })
    } else {
      const response: StockMovementResult = { data: Mapper.ToTransfer(result.data) }
      await this.logsService.logSuccess({ key: response.data.movementCode, module: LogModule.STOCK_MOVEMENT, requestObject: movementRequest, responseObject: result });
      return response;
    }

  }

  async validate(request: StockMovementRequest): Promise<void> {

    const branch = await this.hanaBusinessPartnersService.getBranch(request.businessPlaceCode);
    if (!branch) {
      throw new Exception({ code: 'X001', message: `Filial [${request.businessPlaceCode}] não encontrada.`, request, response: null });
    }

    for (const line of request.items) {
      const warehouse = await this.hanaInventoryLocationService.getWarehouse(request.businessPlaceCode, line.warehouseCode);
      if (!warehouse) {
        throw new Exception({ code: 'X002', message: `Depósito [${line.warehouseCode}] não encontrado.`, request, response: null });
      }

      if (request.movementType == MOVEMENT_TYPE.TRANSFER) {
        const warehouse = await this.hanaInventoryLocationService.getWarehouse(request.businessPlaceCode, line.fromWarehouseCode);
        if (!warehouse) {
          throw new Exception({ code: 'X002', message: `Depósito origem [${line.fromWarehouseCode}] não encontrado.`, request, response: null });
        }
      }

      if (request.movementType != MOVEMENT_TYPE.TRANSFER) {
        const costCenter = await this.hanaCostCenterService.getCostCenter(line.costCenterCode);
        if (!costCenter) {
          throw new Exception({ code: 'X003', message: `Centro de custo [${line.costCenterCode}] não encontrado.`, request, response: null });
        } else {
          line.costCenterType = costCenter.U_Tipo;
        }
      }

      const item = await this.hanaItemService.getItem(line.itemCode);
      if (!item) {
        throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não encontrado.`, request, response: null });
      } else {
        if (request.movementType === MOVEMENT_TYPE.ENTRY) {
          line.price = item.Price;
        }
        if (item["ManBtchNum"] == 'Y') {
          if (line.batchNumbers == null || line.batchNumbers.length == 0) {
            throw new Exception({ code: 'X005', message: `Item [${line.itemCode}] é controlado por lotes porém não foi informado nenhum lote na movimentação.`, request, response: null });
          }
        }
      }
    }

  }


}

