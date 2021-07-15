import { Injectable } from '@nestjs/common';
import { ODataService } from '../odata/odata.service'
import { JournalEntryDocument } from './interfaces';

@Injectable()
export class JournalEntriesRequestsService extends ODataService<JournalEntryDocument> {

  constructor() {
    super();
    this.path = "JournalEntries";
  }
  
}
