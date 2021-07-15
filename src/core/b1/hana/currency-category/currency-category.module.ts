import { Module } from '@nestjs/common';
import { HanaCurrencyCategoryService } from './currency-category.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaCurrencyCategoryService],
  exports: [HanaCurrencyCategoryService]
})

export class HanaCurrencyCategoryModule {}
