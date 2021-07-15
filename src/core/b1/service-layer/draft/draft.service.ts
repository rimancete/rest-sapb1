import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { Document } from './interfaces';
import { PurchaseRequest } from '../purchase-requests/interfaces';

@Injectable()
export class DraftService extends ODataService<any> {

  constructor() {
    super();
    this.path = "Drafts";
  }



}
