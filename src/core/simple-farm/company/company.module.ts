import { Module } from '@nestjs/common';
import { SimpleFarmCompanyService } from './company.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmCompanyService],
	exports: [SimpleFarmCompanyService]
})

export class SimpleFarmCompanyModule { }
