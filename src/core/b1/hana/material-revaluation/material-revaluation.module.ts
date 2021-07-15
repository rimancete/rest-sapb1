import { Module } from '@nestjs/common';
import { HanaMaterialRevaluationService } from './material-revaluation.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaMaterialRevaluationService],
  exports: [HanaMaterialRevaluationService]
})

export class HanaMaterialRevoluationModule {}
