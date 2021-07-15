import { Module } from '@nestjs/common';
import { HttpModule } from '../http/http.module';
import { ODataService } from './odata.service';

@Module({
  imports: [HttpModule],
  providers: [ODataService],
  exports: [HttpModule, ODataService]
})

export class ODataModule {}
