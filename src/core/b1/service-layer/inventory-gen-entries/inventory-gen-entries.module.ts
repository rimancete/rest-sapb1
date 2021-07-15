import { Module } from '@nestjs/common';
import { InventoryGenEntriesService } from './inventory-gen-entries.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [InventoryGenEntriesService],
  exports: [InventoryGenEntriesService]
})

export class InventoryGenEntriesModule { }
