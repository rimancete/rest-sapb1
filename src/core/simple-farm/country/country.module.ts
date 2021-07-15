import { Module } from '@nestjs/common';
import { SimpleFarmCountryService } from './country.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmCountryService],
	exports: [SimpleFarmCountryService]
})

export class SimpleFarmCountryModule { }
