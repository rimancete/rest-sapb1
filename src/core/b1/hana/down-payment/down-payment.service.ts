import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DownPayment } from '../../../../api/sale/down-payment/interfaces/service';
import * as _ from 'lodash';

@Injectable()
export class HanaDownPaymentService extends DatabaseService<any> {

	async getExistingOrder(orderNum: string): Promise<DownPayment> {

		const query = `  
    SELECT 
      "CardCode",
      "DocEntry",
      "BPLId"       
    FROM 
      ${this.databaseName}.ORDR 
    WHERE
      "DocNum" = '${orderNum}'
    `;

    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }    
	}
}