import { Module } from '@nestjs/common';
import { HanaCityService } from './city.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaCityService],
  exports: [HanaCityService]
})

export class HanaCityModule {}
