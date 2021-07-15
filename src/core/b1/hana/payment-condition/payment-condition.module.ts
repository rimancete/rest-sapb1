import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaPaymentConditionService } from './payment-condition';

@Module({
  imports: [DatabaseModule],
  providers: [HanaPaymentConditionService],
  exports: [HanaPaymentConditionService]
})

export class HanaPaymentConditionModule {}
