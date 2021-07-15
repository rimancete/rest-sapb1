import { Module } from '@nestjs/common';
import { MaterialRevaluationRequestsService } from './material-revaluation.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [MaterialRevaluationRequestsService],
  exports: [MaterialRevaluationRequestsService]
})

export class MaterialRevoluationRequestsModule { }
