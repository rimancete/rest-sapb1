import { Injectable, Logger } from '@nestjs/common';
import { Mapper } from './interfaces/service';
import { PurchaseOrdersRequest, PurchaseOrdersResult } from './interfaces/controller';
import { HanaBusinessPartnersService } from '../../../core/b1/hana/business-partners/business-partners.service';
import { HanaCostCenterService } from '../../../core/b1/hana/cost-center/cost-center.service';
import { HanaInventoryLocationService } from '../../../core/b1/hana/inventory-location/inventory-location.service'
import { HanaItemService } from '../../../core/b1/hana/item/item.service';
import { LogsService } from '../../../core/logs/logs.service';
import { LogModule } from '../../../core/logs/interface';
import { Exception } from '../../../core/exception';
import { ServiceLayerPurchaseOrdersService } from '../../../core/b1/service-layer/purchase-orders/purchase-orders.service';
import { HanaProjectService } from '../../../core/b1/hana/project/project.service';
import { HanaContractService } from '../../../core/b1/hana/contract/contract.service';
import { DraftService } from '../../../core/b1/service-layer/draft/draft.service';
import e = require('express');

@Injectable()
export class PurchaseOrdersService {

  private logger = new Logger(PurchaseOrdersService.name);

  constructor(
    private readonly serviceLayerPurchaseOrdersService: ServiceLayerPurchaseOrdersService,
    private readonly hanaBusinessPartnersService: HanaBusinessPartnersService,
    private readonly hanaCostCenterService: HanaCostCenterService,
    private readonly hanaInventoryLocationService: HanaInventoryLocationService,
    private readonly hanaItemService: HanaItemService,
    private readonly hanaProjectService: HanaProjectService,
    private readonly hanaContractService: HanaContractService,
    private readonly logsService: LogsService,
    private readonly draftsService: DraftService) { }

  async insertOrUpdate(token: string, purchaseRequest: PurchaseOrdersRequest): Promise<PurchaseOrdersResult> {
    try {
      await this.validate(purchaseRequest);
      return await this.insert(token, purchaseRequest);
    }
    catch (exception) {
      await this.logsService.logError({ key: purchaseRequest.reference, module: LogModule.PURCHASE_ORDER, exception });
      return { data: null, error: { ...exception } };
    }
  }

  async validate(request: PurchaseOrdersRequest): Promise<void> {
    console.log(JSON.stringify(request));
    const branch = await this.hanaBusinessPartnersService.getBranch(request.businessPlaceCode);

    if (!branch) {
      throw new Exception({ code: 'X001', message: `Filial [${request.businessPlaceCode}] não encontrada.`, request, response: null });
    }

    const project = await this.hanaProjectService.getProject(request.projectCode);
    if (!project) {
      throw new Exception({ code: 'X006', message: `Projeto [${request.projectCode}] não encontrado.`, request, response: null });
    }

    const partner = await this.hanaBusinessPartnersService.getPartner(request.partnerCode);
    if (!partner) {
      throw new Exception({ code: 'X008', message: `Parceiro [${request.partnerCode}] não encontrado.`, request, response: null });
    }

    if (!request.orderType) {
      throw new Exception({ code: 'X009', message: `Tipo de Pedido não informado.`, request, response: null });
    }


    if (!request.documentDate) {
      throw new Exception({ code: 'X011', message: `Data do documento não informada.`, request, response: null });
    }

    if (!request.documentDueDate) {
      throw new Exception({ code: 'X012', message: `Data de vencimento do documento não informada.`, request, response: null });
    }

    const warehouseDF = await this.hanaContractService.getWareHouse(request);

    for (const line of request.items) {

      line.warehouseCode = (warehouseDF === undefined ? branch["DflWhs"] : warehouseDF[0] ? warehouseDF[0].WhsCode : branch["DflWhs"]);

      const costCenter = await this.hanaCostCenterService.getCostCenter(line.costCenterCode);
      if (!costCenter) {
        throw new Exception({ code: 'X003', message: `Centro de custo [${line.costCenterCode}] não encontrado.`, request, response: null });
      }

      const item = await this.hanaItemService.getContractItem(request.contractCode, line.itemCode);
      if (!item) {
        throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não encontrado.`, request, response: null });
      } else {
        line.itemCode = item["ItemCode"];
      }

      const relationData = await this.hanaItemService.getDocEntry(line.itemCode, request.contractCode);
      if (!relationData) {
        throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não encontrado no contrato.`, request, response: null });
      } else {
        line.BaseEntry = relationData["DocEntry"]
        line.BaseLine = relationData["LineNum"];
        line.BaseType = 540000006;
      }
    }
  }

  async insert(token: string, request: PurchaseOrdersRequest): Promise<PurchaseOrdersResult> {
   
    const entity = Mapper.From(request);
    console.log('Purchase Order');
    console.log(JSON.stringify(entity));
    const result = await this.serviceLayerPurchaseOrdersService.session(token).create(entity);
    console.log('result:' , result);
    if (result.error) {
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })
    } else {
      const response: PurchaseOrdersResult = { data: Mapper.To(result.data) }
      await this.logsService.logSuccess({ key: response.data.requestCode, module: LogModule.PURCHASE_ORDER, requestObject: request, responseObject: result });
      return response;
    }

  }

}
