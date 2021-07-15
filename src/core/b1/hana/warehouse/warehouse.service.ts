import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { LogModule, LogType } from '../../../logs/interface';
import { Branch } from './intefaces/index';
import * as _ from 'lodash';

@Injectable()
export class HanaWareHouseService extends DatabaseService<any> {

  async getWareHouse(id: string): Promise<Branch[]> {

    const query = `
                  SELECT 
                    "WhsCode"
                  FROM 
                    ${this.databaseName}.OWHS
                  WHERE 
                    "WhsCode" = '${id}'
			            `;

    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }

}
