import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { MaterialRevaluation } from '../../service-layer/material-revaluation/interfaces';
import * as _ from 'lodash';

@Injectable()
export class HanaMaterialRevaluationService extends DatabaseService<any> {


  async getMaterial(id: string, price: string): Promise<MaterialRevaluation> {

    const query = `
                  SELECT "DocEntry"

                  FROM ${this.databaseName}."MRV1"

                  WHERE "ItemCode" = '${id}' AND "Price" = '${price}'
      `;
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }

  }

  

}
