import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaSaleService } from './sale.service';

@Module({
  imports: [DatabaseModule],
  providers: [HanaSaleService],
  exports: [HanaSaleService]
})

export class HanaSaleModule {}
