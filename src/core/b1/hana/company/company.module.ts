import { Module } from '@nestjs/common';
import { HanaCompanyService } from './company.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaCompanyService],
  exports: [HanaCompanyService]
})

export class HanaCompanyModule { }
