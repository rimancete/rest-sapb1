import { Module } from '@nestjs/common';
import { HanaLogModule } from '../../core/b1/hana/log/log.module'
import { LogsService } from './logs.service';

@Module({
	imports: [HanaLogModule],
	providers: [LogsService],
	exports: [LogsService],
})
export class LogsModule { }
