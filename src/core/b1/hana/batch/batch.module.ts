import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaBatchService } from './batch.service';

@Module({
  imports: [DatabaseModule],
  providers: [HanaBatchService],
  exports: [HanaBatchService]
})

export class HanaBatchModule {}
