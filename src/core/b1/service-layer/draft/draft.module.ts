import { Module } from '@nestjs/common';
import { DraftService } from './draft.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [DraftService],
  exports: [DraftService]
})

export class DraftModule { }
