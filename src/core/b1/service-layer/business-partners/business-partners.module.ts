import { Module } from '@nestjs/common';
import { BusinessPartnersService } from './business-partners.service';
import { ODataModule } from '../odata/odata.module';

@Module({
  imports: [ODataModule],
  providers: [BusinessPartnersService],
  exports: [BusinessPartnersService]
})

export class BusinessPartnersModule { }
