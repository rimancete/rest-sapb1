import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaContractService } from './contract.service';

@Module({
  imports: [DatabaseModule],
  providers: [HanaContractService],
  exports: [HanaContractService]
})

export class HanaContractModule {}
