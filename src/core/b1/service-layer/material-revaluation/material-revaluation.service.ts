import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { MaterialRevaluation } from './interfaces';

@Injectable()
export class MaterialRevaluationRequestsService extends ODataService<MaterialRevaluation> {

  constructor() {
    super();
    this.path = "MaterialRevaluation";
  }
  
}
