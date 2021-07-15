import { Module } from '@nestjs/common';
import { HanaCostCenterService } from './cost-center.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaCostCenterService],
  exports: [HanaCostCenterService]
})

export class HanaCostCenterModule {}
