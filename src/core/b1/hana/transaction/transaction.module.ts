import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaTransactionService } from './transaction.service';

@Module({
  imports: [DatabaseModule],
  providers: [HanaTransactionService],
  exports: [HanaTransactionService]
})

export class HanaTransactionModule {}
