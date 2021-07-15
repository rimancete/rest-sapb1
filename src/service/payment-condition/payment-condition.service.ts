import { Injectable, Logger } from '@nestjs/common';
import { LogsService } from '../../core/logs/logs.service';
import { LogModule } from '../../core/logs/interface';
import { Runner } from '../../core/runner';
import * as _ from 'lodash';
import { HanaPaymentConditionService } from 'src/core/b1/hana/payment-condition/payment-condition';
import { SimpleFarmPaymentConditionService } from 'src/core/simple-farm/payment-condition/payment-condition.service';

@Injectable()
export class PaymentConditionService extends Runner {

  private logger = new Logger(PaymentConditionService.name);

  constructor(
    private readonly hanaPaymentConditionService: HanaPaymentConditionService,
    private readonly simpleFarmPaymentConditionService: SimpleFarmPaymentConditionService,
    private readonly logsService: LogsService
  ) {
    super();
  }

  async proccess() {

    const records = await this.hanaPaymentConditionService.getNotIntegrated();

    if (records.length > 0) {
      this.logger.log(`Found ${records.length} records to integrate...`)
    }
    
    for (const record of records) {
      try {
        const rawInstallments = await this.hanaPaymentConditionService.getNotIntegratedInstallments(record.GroupNum);
        const installments = rawInstallments.map(Installment => {
          return {
            PaymentConditionCode: Installment.CTGCode,
            Sequence: Installment.IntsNo,
            PercentValue: Installment.InstPrcnt,
            Days: Installment.InstDays
          }
        });
        const recordData = {
          Code: record.GroupNum,
          Description: record.PymntGroup,
          ShortName: record.PymntGroup,
          FixedDay: false,
          Anticipated: false,
          Type: record.Type,
          Active: true,
          Installments: installments
        }
        
        const responseObject = await this.simpleFarmPaymentConditionService.upsert(recordData);

        await this.hanaPaymentConditionService.setIntegrated(record);
        this.logsService.logSuccess({
        	key: record.GroupNum, module: LogModule.PAYMENT_CONDITION, requestObject: recordData, responseObject
        });
      }
      catch (exception) {
        this.logsService.logError({ key: record.GroupNum, module: LogModule.PAYMENT_CONDITION, exception });
      }
    }

    if (records.length > 0) {
      this.logger.log(`Finished integration...`)
    }

  }

}