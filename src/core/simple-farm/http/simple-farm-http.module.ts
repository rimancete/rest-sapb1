import { Module } from '@nestjs/common';
import { SimpleFarmHttpService } from './simple-farm-http.service';
import { ConfigModule } from '../../config/config.module';

@Module({
	imports: [ConfigModule],
	providers: [SimpleFarmHttpService],
	exports: [SimpleFarmHttpService]
})

export class SimpleFarmHttpModule { }
