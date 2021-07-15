import { Module } from '@nestjs/common';
import { HanaWareHouseService } from './warehouse.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaWareHouseService],
  exports: [HanaWareHouseService]
})

export class HanaWareHouseModule {}
