import { Module } from '@nestjs/common';
import { SimpleFarmSupplierClientService } from './supplier-client.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmSupplierClientService],
	exports: [SimpleFarmSupplierClientService]
})

export class SimpleFarmSupplierClient { }
