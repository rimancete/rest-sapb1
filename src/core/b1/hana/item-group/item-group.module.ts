import { Module } from '@nestjs/common';
import { HanaItemGroupService } from './item-group.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaItemGroupService],
  exports: [HanaItemGroupService]
})

export class HanaItemGroupModule {}
