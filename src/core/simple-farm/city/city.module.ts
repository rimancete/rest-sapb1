import { Module } from '@nestjs/common';
import { SimpleFarmCityService } from './city.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmCityService],
	exports: [SimpleFarmCityService]
})

export class SimpleFarmCityModule { }
