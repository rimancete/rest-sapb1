import { Injectable, Logger } from '@nestjs/common';
import { InventoryTransferRequestsService } from '../../../core/b1/service-layer/inventory-transfer-requests/inventory-transfer-requests.service';
import { StockTransferRequestRequest, StockTransferRequestResult } from './interfaces/controller';
import { HanaBusinessPartnersService } from '../../../core/b1/hana/business-partners/business-partners.service';
import { HanaInventoryLocationService } from '../../../core/b1/hana/inventory-location/inventory-location.service'
import { InventoryTransferRequest } from '../../../core/b1/service-layer/inventory-transfer-requests/interfaces';
import { HanaCostCenterService } from '../../../core/b1/hana/cost-center/cost-center.service';
import { HanaItemService } from '../../../core/b1/hana/item/item.service';
import { LogsService } from '../../../core/logs/logs.service';
import { LogModule } from '../../../core/logs/interface';
import { Exception } from '../../../core/exception';
import { MOVEMENT_TYPE } from './interfaces/controller';
import { Mapper } from './interfaces/service';
import * as _ from 'lodash';
import { InventoryGenEntriesService } from '../../../core/b1/service-layer/inventory-gen-entries/inventory-gen-entries.service';

@Injectable()
export class StockTransferRequestService {

  private logger = new Logger(StockTransferRequestService.name);

  constructor(
    private readonly inventoryTransferRequestsService: InventoryTransferRequestsService,
    private readonly inventoryGenEntriesService: InventoryGenEntriesService,
    private readonly hanaBusinessPartnersService: HanaBusinessPartnersService,
    private readonly hanaInventoryLocationService: HanaInventoryLocationService,
    private readonly hanaCostCenterService: HanaCostCenterService,
    private readonly hanaItemService: HanaItemService,
    private readonly logsService: LogsService) { }

  async insertTransferRequest(token: string, transferRequest: StockTransferRequestRequest): Promise<StockTransferRequestResult> {
    
    try {
      await this.validate(transferRequest);

      switch (transferRequest.type) {
        case MOVEMENT_TYPE.REQUISICAO: {
          return await this.insert(token, transferRequest);
        }
        case MOVEMENT_TYPE.DEVOLUCAO: {
          return await this.insertEntry(token, transferRequest);
        }
      }

    }
    catch (exception) {
      await this.logsService.logError({ key: transferRequest.reference, module: LogModule.STOCK_TRANSFER_REQUEST, exception });
      return { data: null, error: { ...exception } };
    }

  }

  async validate(request: StockTransferRequestRequest): Promise<void> {

    const branch = await this.hanaBusinessPartnersService.getBranch(request.businessPlaceCode);
    if (!branch) {
      throw new Exception({ code: 'X001', message: `Filial [${request.businessPlaceCode}] não encontrada.`, request, response: null });
    }

    for (const line of request.items) {
      const warehouse = await this.hanaInventoryLocationService.getWarehouse(request.businessPlaceCode, line.warehouseCode);
      if (!warehouse) {
        throw new Exception({ code: 'X002', message: `Depósito [${line.warehouseCode}] não encontrado.`, request, response: null });
      } else {
        if (!warehouse.U_ALFA_ReserveWhs) {
          throw new Exception({ code: 'X006', message: `Depósito de reserva [${line.warehouseCode}] não encontrado.`, request, response: null });
        }
        line.toWarehouseCode = warehouse.U_ALFA_ReserveWhs;
      }

      const costCenter = await this.hanaCostCenterService.getCostCenter(line.costCenterCode);
      if (!costCenter) {
        throw new Exception({ code: 'X003', message: `Centro de custo [${line.costCenterCode}] não encontrado.`, request, response: null });
      }

      const item = await this.hanaItemService.getItem(line.itemCode);
      if (!item) {
        throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não encontrado.`, request, response: null });
      }

    }
  }

  async insert(token: string, request: StockTransferRequestRequest): Promise<StockTransferRequestResult> {

    const entity = Mapper.From(request);
    const size = entity.U_ALFA_RequestNumber.length;
    entity.U_ALFA_RequestNumber = entity.U_ALFA_RequestNumber.substr(3, size);
    const result = await this.inventoryTransferRequestsService.session(token).create(entity);

    if (result.error) {
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })
    } else {
      const response: StockTransferRequestResult = { data: Mapper.To(result.data) }
      await this.logsService.logSuccess({ key: response.data.requestCode, module: LogModule.STOCK_TRANSFER_REQUEST, requestObject: request, responseObject: result });
      return response;
    }

  }

  async insertEntry(token: string, request: StockTransferRequestRequest): Promise<StockTransferRequestResult> {

    const entity = Mapper.FromDevolution(request);
    this.inventoryGenEntriesService.setTypeDraftEntry();
    const result = await this.inventoryGenEntriesService.session(token).create(entity);

    if (result.error) {
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })
    } else {
      console.log(result.data);
      const response: StockTransferRequestResult = { data: Mapper.To(result.data) }
      await this.logsService.logSuccess({ key: response.data.requestCode, module: LogModule.STOCK_TRANSFER_REQUEST, requestObject: request, responseObject: result });
      return response;
    }

  }

}
