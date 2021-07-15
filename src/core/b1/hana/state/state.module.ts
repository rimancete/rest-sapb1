import { Module } from '@nestjs/common';
import { HanaStateService } from './state.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaStateService],
  exports: [HanaStateService]
})

export class HanaStateModule {}
