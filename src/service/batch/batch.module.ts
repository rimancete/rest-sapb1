import { Module } from '@nestjs/common';
import { LogsModule } from '../../core/logs/logs.module';
import { BatchService } from './batch.service';
import { HanaBatchModule } from 'src/core/b1/hana/batch/batch.module';
import { SimpleFarmBatchModule } from 'src/core/simple-farm/batch/batch.module';

@Module({
	imports: [SimpleFarmBatchModule, HanaBatchModule, LogsModule],
	providers: [BatchService],
	exports: [BatchService],
})
export class BatchModule { }
