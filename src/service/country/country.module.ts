import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { SimpleFarmCountryModule } from '../../core/simple-farm/country/country.module';
import { HanaCountryModule } from '../../core/b1/hana/country/country.module'
import { LogsModule } from '../../core/logs/logs.module';

@Module({
	imports: [HanaCountryModule, SimpleFarmCountryModule, LogsModule],
	providers: [CountryService],
	exports: [CountryService],
})
export class CountryModule { }
