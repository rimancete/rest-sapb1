import { Module } from '@nestjs/common';
import { HanaItemService } from './item.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaItemService],
  exports: [HanaItemService]
})

export class HanaItemModule {}
