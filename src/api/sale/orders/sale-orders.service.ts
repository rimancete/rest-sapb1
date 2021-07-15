import { Injectable, Logger } from '@nestjs/common';
import { Mapper } from './interfaces/service';
import { SaleOrdersRequest, SaleOrdersResult } from './interfaces/controller';
import { HanaBusinessPartnersService } from '../../../core/b1/hana/business-partners/business-partners.service';
import { HanaCostCenterService } from '../../../core/b1/hana/cost-center/cost-center.service';
import { HanaInventoryLocationService } from '../../../core/b1/hana/inventory-location/inventory-location.service'
import { HanaItemService } from '../../../core/b1/hana/item/item.service';
import { LogsService } from '../../../core/logs/logs.service';
import { LogModule } from '../../../core/logs/interface';
import { Exception } from '../../../core/exception';
import { ServiceLayerSaleOrdersService } from 'src/core/b1/service-layer/sale-orders/sale-orders.service';
import { HanaProjectService } from 'src/core/b1/hana/project/project.service';
import { HanaContractService } from 'src/core/b1/hana/contract/contract.service';
import { HanaWareHouseService } from '../../../core/b1/hana/warehouse/warehouse.service'
import { HanaUnitMeasurementService } from 'src/core/b1/hana/unit-measurement/unit-measurement.service';
import { HanaSaleService } from '../../../core/b1/hana/sale/sale.service';
import * as _ from 'lodash';

@Injectable()
export class SaleOrdersService {

  private logger = new Logger(SaleOrdersService.name);

  constructor(
    private readonly serviceLayerSaleOrdersService: ServiceLayerSaleOrdersService,
    private readonly hanaBusinessPartnersService: HanaBusinessPartnersService,
    private readonly hanaCostCenterService: HanaCostCenterService,
    private readonly hanaInventoryLocationService: HanaInventoryLocationService,
    private readonly hanaItemService: HanaItemService,
    private readonly hanaProjectService: HanaProjectService,
    private readonly hanaContractService: HanaContractService,
    private readonly hanaWareHouseService: HanaWareHouseService,
    private readonly hanaUnitMeasureService: HanaUnitMeasurementService,
    private readonly hanaSaleService: HanaSaleService,
    private readonly logsService: LogsService) { }

  async insertOrUpdate(token: string, saleOrdersRequest: SaleOrdersRequest): Promise<SaleOrdersResult> {
    try {
      await this.validate(saleOrdersRequest);
      return await this.insert(token, saleOrdersRequest);
    }
    catch (exception) {
      await this.logsService.logError({ key: saleOrdersRequest.reference, module: LogModule.SALE_ORDER, exception });
      return { data: null, error: { ...exception } };
    }
  }

  async validate(request: SaleOrdersRequest): Promise<void> {

    const branch = await this.hanaBusinessPartnersService.getBranch(request.businessPlaceCode);
    if (!branch) {
      throw new Exception({ code: 'X001', message: `Filial [${request.businessPlaceCode}] não encontrada.`, request, response: null });
    }

    const partner = await this.hanaBusinessPartnersService.getPartner(request.partnerCode);
    if (!partner) {
      throw new Exception({ code: 'X008', message: `Parceiro [${request.partnerCode}] não encontrado.`, request, response: null });
    }

    if (!request.documentDate) {
      throw new Exception({ code: 'X011', message: `Data do documento não informada.`, request, response: null });
    }

    if (!request.documentDueDate) {
      throw new Exception({ code: 'X012', message: `Data de vencimento não informada.`, request, response: null });
    }

    for (const line of request.items) {
      const costCenter = await this.hanaCostCenterService.getCostCenter(line.costCenterCode);
      if (!costCenter) {
        throw new Exception({ code: 'X003', message: `Centro de custo [${line.costCenterCode}] não encontrado.`, request, response: null });
      }

      const wareHouse = await this.hanaWareHouseService.getWareHouse(line.warehouseCode);
      if (!wareHouse) {
        throw new Exception({ code: 'X007', message: `Depósito [${line.warehouseCode}] não encontrado.`, request, response: null });
      }

      const item = await this.hanaItemService.getItem(line.itemCode);
      if (!item) {
        throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não encontrado.`, request, response: null });
      }

      const oumEntry = await this.hanaUnitMeasureService.getUOMEntry(line.measureUnit);
      if (!oumEntry) {
        throw new Exception({ code: 'X009', message: `Unidade de medida [${line.measureUnit}] não encontrado.`, request, response: null });
      } else {
        line.measureUnitId = oumEntry;
      }
      
      const itemMeasureUnit = await this.hanaItemService.getItemMeasureUnit(line.itemCode);
      if (!itemMeasureUnit) {
          throw new Exception({ code: 'X0014', message: `Unidade de medida de venda do item [${line.itemCode}] não foi encontrado.`, request, response: null });
      }
      else {
          line.measureUnit = itemMeasureUnit.UomCode;
          line.measureUnitId = itemMeasureUnit.UomEntry;
          line.quantity = line.quantity/itemMeasureUnit.NumInSale;  
          line.price = line.price*itemMeasureUnit.NumInSale;     
      }
    }
  }

  async insert(token: string, request: SaleOrdersRequest): Promise<SaleOrdersResult> {

    const entity = Mapper.From(request);

    console.log('sale-order - entity',entity);

    const existingSaleOrder = await this.hanaSaleService.getByReferenceNum(entity.U_ALFA_pedidoId);
    let result: any = null;
    
    if (existingSaleOrder) {
      // Retirada checagem conforme combinado e validado com Thiago Coelho 31/06/21
      // if (existingSaleOrder.Open === 0) {
      //   entity.DocumentLines.forEach(f => delete f.UnitPrice);
      // }      
      result = await this.serviceLayerSaleOrdersService.session(token).update(existingSaleOrder.DocEntry, entity, true);
    } else {
      result = await this.serviceLayerSaleOrdersService.session(token).create(entity);

    }

      console.log('sale-order - result:' , result);
      if (result.error) {
        await this.logsService.logError({
          key: existingSaleOrder.DocEntry,
          module: LogModule.SALE_ORDER,
          exception: new Exception({
            code: 'X005',
            message: result.error.innerMessage,
            request,
            response: result
          }),
        });

        // throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })
    } else {

      let response: SaleOrdersResult = null;
      if (existingSaleOrder)
        response = { data: { orderId: existingSaleOrder.DocEntry, orderNum: existingSaleOrder.DocNum } };
      else
        response = { data: Mapper.To(result.data) }

      await this.logsService.logSuccess({ key: response.data.orderId, module: LogModule.SALE_ORDER, requestObject: request, responseObject: result });
      return response;

    }

  }

}
