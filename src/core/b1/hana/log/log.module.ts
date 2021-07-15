import { Module } from '@nestjs/common';
import { HanaLogService } from './log.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaLogService],
  exports: [HanaLogService]
})

export class HanaLogModule {}
