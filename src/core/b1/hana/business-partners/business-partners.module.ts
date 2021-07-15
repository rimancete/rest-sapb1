import { Module } from '@nestjs/common';
import { HanaBusinessPartnersService } from './business-partners.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [HanaBusinessPartnersService],
  exports: [HanaBusinessPartnersService]
})

export class HanaBusinessPartnersModule {}
