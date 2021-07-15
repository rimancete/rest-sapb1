import { Module } from '@nestjs/common';
import { SimpleFarmUnitMeasurementService } from './unit-measurement.service';
import { ConfigModule } from '../../config/config.module';
import { SimpleFarmHttpModule } from '../../../core/simple-farm/http/simple-farm-http.module';

@Module({
	imports: [ConfigModule, SimpleFarmHttpModule],
	providers: [SimpleFarmUnitMeasurementService],
	exports: [SimpleFarmUnitMeasurementService]
})

export class SimpleFarmUnitMeasurementModule { }
