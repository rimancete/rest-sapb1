import { Module } from '@nestjs/common';
import { SimpleFarmSupplierClientAddressService } from './supplier-client-address.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmSupplierClientAddressService],
	exports: [SimpleFarmSupplierClientAddressService]
})

export class SimpleFarmSupplierClientAddressModule { }
