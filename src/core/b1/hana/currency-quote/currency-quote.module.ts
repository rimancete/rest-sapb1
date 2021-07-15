import { Module } from '@nestjs/common';
import { HanaCurrencyQuoteService } from './currency-quote.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaCurrencyQuoteService],
  exports: [HanaCurrencyQuoteService]
})

export class HanaCurrencyQuoteModule {}
