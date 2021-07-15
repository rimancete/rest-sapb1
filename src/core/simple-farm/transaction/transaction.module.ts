import { Module } from '@nestjs/common';
import { SimpleFarmTransactionService } from './transaction.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmTransactionService],
	exports: [SimpleFarmTransactionService]
})

export class SimpleFarmTransactionModule { }
