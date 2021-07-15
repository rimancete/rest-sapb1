import { Module } from '@nestjs/common';
import { HanaCountryService } from './country.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaCountryService],
  exports: [HanaCountryService]
})

export class HanaCountryModule {}
