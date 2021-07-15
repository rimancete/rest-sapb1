import { Module } from '@nestjs/common';
import { HanaCurrencyService } from './currency.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaCurrencyService],
  exports: [HanaCurrencyService]
})

export class HanaCurrencyModule {}
