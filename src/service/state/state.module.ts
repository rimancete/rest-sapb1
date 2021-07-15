import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { SimpleFarmStateModule } from '../../core/simple-farm/state/state.module';
import { HanaStateModule } from '../../core/b1/hana/state/state.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [SimpleFarmStateModule, HanaStateModule, LogsModule],
	controllers: [],
	providers: [StateService],
	exports: [StateService],
})
export class StateModule { }
