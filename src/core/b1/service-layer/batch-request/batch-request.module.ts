import { Module, Global } from '@nestjs/common';
import { BatchRequestService } from './batch-request.service';
import { ODataModule } from '../odata/odata.module';

@Global()
@Module({
  imports: [ODataModule],
  providers: [BatchRequestService],
  exports: [BatchRequestService]
})

export class BatchRequestModule { }
