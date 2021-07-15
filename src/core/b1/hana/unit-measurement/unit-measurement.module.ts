import { Module } from '@nestjs/common';
import { HanaUnitMeasurementService } from './unit-measurement.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaUnitMeasurementService],
  exports: [HanaUnitMeasurementService]
})

export class HanaUnitMeasurementModule { }