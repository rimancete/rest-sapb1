import { Module } from '@nestjs/common';
import { SimpleFarmItemGroupService } from './item-group.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmItemGroupService],
	exports: [SimpleFarmItemGroupService]
})

export class SimpleFarmItemGroupModule { }
