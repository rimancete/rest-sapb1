import { Module } from '@nestjs/common';
import { HanaDownPaymentService } from './down-payment.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaDownPaymentService],
  exports: [HanaDownPaymentService]
})

export class HanaDownPaymentModule {}
