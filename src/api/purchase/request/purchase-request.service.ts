import { Injectable, Logger } from '@nestjs/common';
import { Mapper } from './interfaces/service';
import { PurchaseRequestRequest, PurchaseRequestResult } from './interfaces/controller';
import { PurchaseRequest } from '../../../core/b1/service-layer/purchase-requests/interfaces';
import { PurchaseRequestsService } from '../../../core/b1/service-layer/purchase-requests/purchase-requests.service';
import { HanaBusinessPartnersService } from '../../../core/b1/hana/business-partners/business-partners.service';
import { HanaCostCenterService } from '../../../core/b1/hana/cost-center/cost-center.service';
import { HanaInventoryLocationService } from '../../../core/b1/hana/inventory-location/inventory-location.service'
import { HanaItemService } from '../../../core/b1/hana/item/item.service';
import { LogsService } from '../../../core/logs/logs.service';
import { LogModule } from '../../../core/logs/interface';
import { Exception } from '../../../core/exception';
import { HanaProjectService } from '../../../core/b1/hana/project/project.service';
import { DraftService } from 'src/core/b1/service-layer/draft/draft.service';

@Injectable()
export class PurchaseRequestService {

  private logger = new Logger(PurchaseRequestService.name);
  private DEFAULT_OPTIONS = {
    BPL: 9,
    WHS: "08",
    REQUESTER: "RODRIGO.BORELLA",
    USAGE: 17,
    CRITICIDADE: 3
  };

  constructor(private readonly purchaseRequestsService: PurchaseRequestsService,
    private readonly hanaBusinessPartnersService: HanaBusinessPartnersService,
    private readonly hanaCostCenterService: HanaCostCenterService,
    private readonly hanaInventoryLocationService: HanaInventoryLocationService,
    private readonly hanaItemService: HanaItemService,
    private readonly hanaProjectService: HanaProjectService,
    private readonly draftService: DraftService,
    private readonly logsService: LogsService) { }

  async insertRequest(token: string, purchaseRequest: PurchaseRequestRequest): Promise<PurchaseRequestResult> {
  
    try {
      await this.validate(purchaseRequest);
      return await this.insert(token, purchaseRequest);
    }
    catch (exception) {
      await this.logsService.logError({ key: purchaseRequest.reference, module: LogModule.PURCHASE_REQUEST, exception });
      return { data: null, error: { ...exception } };
    }

  }

  async validate(request: PurchaseRequestRequest): Promise<void> {

    const branch = await this.hanaBusinessPartnersService.getBranch(request.businessPlaceCode);
    if (!branch) {
      throw new Exception({ code: 'X001', message: `Filial [${request.businessPlaceCode}] não encontrada.`, request, response: null });
    }

    const user = await this.hanaBusinessPartnersService.getUser(request.requester);
    if (!user) {
      request.requester = this.DEFAULT_OPTIONS.REQUESTER;
    }

    for (const line of request.items) {

      const costCenter = await this.hanaCostCenterService.getCostCenter(line.costCenterCode);
      if (!costCenter) {
        throw new Exception({ code: 'X003', message: `Centro de custo [${line.costCenterCode}] não encontrado.`, request, response: null });
      }
      
      const item = await this.hanaItemService.getItem(line.itemCode);
      

      if (!item) {
        throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não encontrado.`, request, response: null });
      } else {
        if (item["PrchseItem"] == 'N'){
          throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não registrado como item de compra.`, request, response: null });
        }

        if (item["U_ALFA_Comprador"] == null) {
          throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] comprador não informado.`, request, response: null });
        } else {
          const comprador = await this.hanaItemService.getComprador(item["U_ALFA_Comprador"]);
          if (comprador) {
            line.buyerCode = item["U_ALFA_Comprador"];
            line.buyerName = comprador["Name"];
          } else {
            throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] comprador não informado.`, request, response: null });
          }
        }
      }
    }
  }

  async insert(token: string, request: PurchaseRequestRequest): Promise<PurchaseRequestResult> {

    const entity = Mapper.From(request);
    
    entity.BPL_IDAssignedToInvoice = this.DEFAULT_OPTIONS.BPL;
    entity.U_ALFA_NivelCriticidade = this.DEFAULT_OPTIONS.CRITICIDADE;
    for (const item of entity.DocumentLines) {
      item.WarehouseCode = this.DEFAULT_OPTIONS.WHS;
      item.Usage = this.DEFAULT_OPTIONS.USAGE;
    }
    entity.DocObjectCode = "1470000113";

    console.log(JSON.stringify(entity));
    const result = await this.purchaseRequestsService.session(token).create(entity);
    if (result.error) {
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })
    } else {
      const response: PurchaseRequestResult = { data: Mapper.To(result.data) }
      await this.logsService.logSuccess({ key: response.data.requestCode, module: LogModule.PURCHASE_REQUEST, requestObject: request, responseObject: result });
      return response;
    }

  }

}
