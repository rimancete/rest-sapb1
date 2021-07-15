import { Injectable } from '@nestjs/common';
import { DatabaseResponse } from '../database/interfaces';
import { DatabaseService } from '../database/database.service';
import { Project } from './intefaces/index';
import * as _ from 'lodash';

@Injectable()
export class HanaProjectService extends DatabaseService<any> {

  async getProject(code: string): Promise<DatabaseResponse<Project[]>> {

    const query =`
    SELECT 
          "PrjCode" 
    FROM ${this.databaseName}.OPRJ 
    
    WHERE "PrjCode" = '${code}' 
    `
    try {
      const result = await this.exec(query);
      return _.first(result.data);
    } catch (exception) {
      return null;
    }
  }

}
