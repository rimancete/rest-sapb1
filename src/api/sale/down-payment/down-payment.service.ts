import { Injectable, Logger } from '@nestjs/common';
import { Mapper, Document } from './interfaces/service';
import { DownPaymentRequest, DownPaymentsResult } from './interfaces/controller';
import { LogsService } from '../../../core/logs/logs.service';
import { LogModule } from '../../../core/logs/interface';
import { Exception } from '../../../core/exception';
import { HanaDownPaymentService } from '../../../core/b1/hana/down-payment/down-payment.service';
import { DownPaymentsRequestsService } from '../../../core/b1/service-layer/down-payment/down-payment.service';
import { HanaSaleService } from '../../../core/b1/hana/sale/sale.service';

@Injectable()
export class DownPaymentsService {

  private logger = new Logger(DownPaymentsService.name);

  constructor(
    private readonly hanaDownPaymentService: HanaDownPaymentService,
    private readonly downPaymentsRequestsService: DownPaymentsRequestsService,
    private readonly hanaSaleService: HanaSaleService,
    private readonly logsService: LogsService) { }

  async insertOrUpdate(token: string, downPaymentRequest: DownPaymentRequest): Promise<any> {
    try {
      const existingOrder = await this.hanaSaleService.getByDocNum(downPaymentRequest.orderId);
      // console.log('Request:' , downPaymentRequest);
      if (existingOrder) {
        const lineNumber = await this.hanaSaleService.getOrderLineNum(downPaymentRequest.orderId)
        const entity = Mapper.From(downPaymentRequest, existingOrder, lineNumber);
        console.log('entity:' , JSON.stringify(entity));
        return await this.insert(token, entity, downPaymentRequest.orderId);
      }
      else {
        throw new Exception({ code: 'X005', message: `Pedido de venda [${downPaymentRequest.orderId}] não encontrado.`, response: '', request: downPaymentRequest })
      }
    }
    catch (exception) {
      await this.logsService.logError({ key: downPaymentRequest.orderId, module: LogModule.DOWN_PAYMENT, exception });
      return { data: null, error: { ...exception } };
    }
  }

  async insert(token: string, request: Document, orderId: string): Promise<DownPaymentsResult> {
    const result = await this.downPaymentsRequestsService.session(token).create(request);
    if (result.error) {
      throw new Exception({ code: 'X005', message: result.error.innerMessage, response: result, request: request })
    }
    else {
      const response: DownPaymentsResult = { data: Mapper.To(result.data) }
      await this.logsService.logSuccess({ key: orderId, module: LogModule.DOWN_PAYMENT, requestObject: request, responseObject: result });
      return response;
    }
  }
}
