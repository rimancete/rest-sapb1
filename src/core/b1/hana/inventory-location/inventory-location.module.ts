import { Module } from '@nestjs/common';
import { HanaInventoryLocationService } from './inventory-location.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaInventoryLocationService],
  exports: [HanaInventoryLocationService]
})

export class HanaInventoryLocationModule {}