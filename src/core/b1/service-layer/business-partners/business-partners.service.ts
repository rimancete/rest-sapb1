import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { BusinessPartner } from './interfaces';

@Injectable()
export class BusinessPartnersService extends ODataService<BusinessPartner> {

  constructor() {
    super();
    this.path = "BusinessPartners";
  }
  
}
