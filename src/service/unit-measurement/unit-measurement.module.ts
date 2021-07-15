import { Module } from '@nestjs/common';
import { UnitMeasurementService } from './unit-measurement.service';
import { SimpleFarmUnitMeasurementModule } from '../../core/simple-farm/unit-measurement/unit-measurement.module';
import { HanaUnitMeasurementModule } from '../../core/b1/hana/unit-measurement/unit-measurement.module';
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [SimpleFarmUnitMeasurementModule, HanaUnitMeasurementModule, LogsModule],
	providers: [UnitMeasurementService],
	exports: [UnitMeasurementService],
})
export class UnitMeasurementModule { }
