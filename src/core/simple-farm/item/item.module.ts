import { Module } from '@nestjs/common';
import { SimpleFarmItemService } from './item.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmItemService],
	exports: [SimpleFarmItemService]
})

export class SimpleFarmItemModule { }
