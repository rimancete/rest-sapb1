import { Module } from '@nestjs/common';
import { HanaItemFamilyService } from './item-family.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaItemFamilyService],
  exports: [HanaItemFamilyService]
})

export class HanaItemFamilyModule {}
