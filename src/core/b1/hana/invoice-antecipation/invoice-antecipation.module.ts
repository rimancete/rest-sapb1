import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaInvoiceAntecipationService } from './invoice-antecipation.service';


@Module({
  imports: [DatabaseModule],
  providers: [HanaInvoiceAntecipationService],
  exports: [HanaInvoiceAntecipationService]
})

export class HanaInvoiceAntecipationModule {}
