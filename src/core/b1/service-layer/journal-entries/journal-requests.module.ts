import { Module } from '@nestjs/common';
import { JournalEntriesRequestsService } from './journal-requests.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [JournalEntriesRequestsService],
  exports: [JournalEntriesRequestsService]
})

export class JournalEntriesRequestsModule { }
