import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { HanaInvoiceAntecipationDeleteService } from './invoice-antecipation-delete.service';


@Module({
  imports: [DatabaseModule],
  providers: [HanaInvoiceAntecipationDeleteService],
  exports: [HanaInvoiceAntecipationDeleteService]
})

export class HanaInvoiceAntecipationDeleteModule {}
