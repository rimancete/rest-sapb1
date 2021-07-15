import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SimpleFarmTransactionModule } from '../../core/simple-farm/transaction/transaction.module';
@Module({
	imports: [SimpleFarmTransactionModule],
	providers: [TransactionService],
	exports: [TransactionService],
})
export class TransactionModule { }
