import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { SaleOrderModel } from './interfaces';

@Injectable()
export class ServiceLayerSaleOrdersService extends ODataService<SaleOrderModel> {

  constructor() {
    super();
    this.path = "Orders";
  }
  
}
