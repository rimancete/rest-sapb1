import { Injectable, Logger } from '@nestjs/common';
import { Mapper } from './interfaces/service';
import { InvoiceRequest, InvoiceResult } from './interfaces/controller';
import { HanaSaleService } from '../../../core/b1/hana/sale/sale.service';
import { LogsService } from '../../../core/logs/logs.service';
import { LogModule } from '../../../core/logs/interface';
import { Exception } from '../../../core/exception';
import { ServiceLayerInvoiceService } from 'src/core/b1/service-layer/invoice/invoice.service';
import { Invoice, InvoiceLine } from '../../../core/b1/service-layer/invoice/interfaces';
import { HanaItemService } from '../../../core/b1/hana/item/item.service';
import { HanaBusinessPartnersService} from '../../../core/b1/hana/business-partners/business-partners.service';
import { HanaCityService} from '../../../core/b1/hana/city/city.service';
import { HanaWareHouseService } from '../../../core/b1/hana/warehouse/warehouse.service'
import { DraftService } from '../../../core/b1/service-layer/draft/draft.service';
@Injectable()
export class InvoiceService {

  private logger = new Logger(InvoiceService.name);

  constructor(
    private readonly serviceLayerInvoiceService: ServiceLayerInvoiceService,
    private readonly hanaSaleService: HanaSaleService,
    private readonly hanaItemService: HanaItemService,
    private readonly hanaBusinessPartnersService : HanaBusinessPartnersService,
    private readonly hanaCityService : HanaCityService,
    private readonly hanaWareHouseService: HanaWareHouseService,
    private readonly logsService: LogsService,
    private readonly draftsService: DraftService) { }

  async insertOrUpdate(token: string, invoiceRequest: InvoiceRequest): Promise<InvoiceResult> {
    try {
      await this.validate(invoiceRequest);
      const order = await this.getOrder(invoiceRequest);
      return await this.insert(token, order, invoiceRequest);
    }
    catch (exception) {
      await this.logsService.logError({ key: invoiceRequest.orderId, module: LogModule.INVOICE, exception });
      return { data: null, error: { ...exception } };
    }

  }

  async getOrder(request: InvoiceRequest): Promise<Invoice> {

    let record = await this.hanaSaleService.getOrder(request.orderId);
    if (record.length > 0) {

      let items = []
      for (const item of request.items) {

        const lineNumber = await this.hanaSaleService.getLine(item.itemCode, request.orderId);

        const line: InvoiceLine = {
          BaseEntry: record[0].DocEntry,
          BaseLine: lineNumber[0].LineNum,
          BaseType: 17,
          ItemCode: item.itemCode,
          Quantity: item.quantity,
          WarehouseCode: item.warehouseCode,
          Usage: item.usage
        }
        items.push(line);
      }

      const entity = Mapper.From(record, request);

      entity.DocumentLines = items;
      entity.U_ALFA_VencimentoNF = request.DtVncNF;
      return entity;

    } else {
      throw new Exception({ code: 'X013', message: `Não foi encontrado o pedido de venda vinculado a este romaneio.`, request, response: null });
    }

  }

  async validate(request: InvoiceRequest): Promise<void> {

    if (!request.orderId) {
      throw new Exception({ code: 'X010', message: `Número do pedido de venda não informado.`, request, response: null });
    }

    if (!request.invoiceNumber) {
      throw new Exception({ code: 'X010', message: `Número do romaneio não informado.`, request, response: null });
    }

    if (!request.documentDate) {
      throw new Exception({ code: 'X011', message: `Data do documento não informada.`, request, response: null });
    }

    if (!request.dueDate) {
      throw new Exception({ code: 'X012', message: `Data de vencimento do documento não informada.`, request, response: null });
    }

    if (request.carrier) {
      const verifyExistPartner = await this.hanaBusinessPartnersService.getPartner(request.carrier.toString());
      if (!verifyExistPartner){
        throw new Exception({ code: 'X015', message: `Transportador ${request.carrier} não foi encontrado`, request, response: null });
      }
      
    }

    if (request.vehicle){
      if (request.vidState){
        const verifyExistState = await this.hanaCityService.verifyExistState(request.vidState);
        if (!verifyExistState){
          throw new Exception({ code: 'X016', message: `Estado ${request.vidState} não foi encontrado`, request, response: null });
        }
      }else{
        throw new Exception({ code: 'X017', message: `Estado do veículo ${request.vehicle} não foi informado`, request, response: null });
      }
      
    }

    for (const line of request.items) {
      const wareHouse = await this.hanaWareHouseService.getWareHouse(line.warehouseCode);
      if (!wareHouse) {
        throw new Exception({ code: 'X007', message: `Depósito [${line.warehouseCode}] não encontrado.`, request, response: null });
      }

      const item = await this.hanaItemService.getItem(line.itemCode);
      if (!item) {
        throw new Exception({ code: 'X004', message: `Item [${line.itemCode}] não encontrado.`, request, response: null });
      }
      
      const itemMeasureUnit = await this.hanaItemService.getItemMeasureUnit(line.itemCode);
      if (!itemMeasureUnit) {
          throw new Exception({ code: 'X0014', message: `Unidade de medida de venda do item [${line.itemCode}] não foi encontrado.`, request, response: null });
      }
      else {
          line.quantity = line.quantity/itemMeasureUnit.NumInSale ;                
      }
    }

  }

  // Remover posteriormente
  generate(n) {
    var add = 1, max = 12 - add;   // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.   

    if (n > max) {
      return this.generate(max) + this.generate(n - max);
    }

    max = Math.pow(10, n + add);
    var min = max / 10; // Math.pow(10, n) basically
    var number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ("" + number).substring(add);
  }

  async insert(token: string, entity: Invoice, request: InvoiceRequest): Promise<InvoiceResult> {

    // Remover Posteriormente
    // const chave = this.generate(44);
    // entity.U_ChaveAcesso = chave;
    entity.U_ALFA_VencimentoNF = request.DtVncNF;
    // const newRecord = {"DocObjectCode": 13, ...entity};
    // console.log('invoice record ', newRecord);

    // // entity.DocObjectCode = "oInvoice";
    // console.log('invoice entity', JSON.stringify(entity));
    // const result = await this.draftsService.session(token).create(newRecord);
    // if (result.error){
    //   console.log('draft error:' , result.error);
    //   throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })  
    // } else {
    //   const response: InvoiceResult = { data: Mapper.To(result.data) };
    //   await this.logsService.logSuccess({ key: response.data.invoiceId, module: LogModule.DRAFTINVOICE, requestObject: request, responseObject: result });
    //   return response;
    // }
    // delete entity.DocObjectCode;
    const result = await this.serviceLayerInvoiceService.session(token).create(entity);
    console.log('result:', result);
    if (result.error) {
      console.log('error:' , result.error);
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })
    } else {
      const response: InvoiceResult = { data: Mapper.To(result.data) }
      await this.logsService.logSuccess({ key: response.data.invoiceId, module: LogModule.INVOICE, requestObject: request, responseObject: result });
      return response;
    }

  }

}
