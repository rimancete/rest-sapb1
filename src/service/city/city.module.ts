import { Module } from '@nestjs/common';
import { CityService } from './city.service';
import { SimpleFarmCityModule } from '../../core/simple-farm/city/city.module';
import { HanaCityModule } from '../../core/b1/hana/city/city.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaCityModule, SimpleFarmCityModule, LogsModule],
	providers: [CityService],
	exports: [CityService],
})
export class CityModule { }
