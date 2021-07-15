import { Module } from '@nestjs/common';
import { HanaBranchService } from './branch.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaBranchService],
  exports: [HanaBranchService]
})

export class HanaBranchModule {}
