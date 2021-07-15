import { Module } from '@nestjs/common';
import { HttpService } from './http.service';
import { ConfigModule } from '../../../config/config.module';

@Module({
  imports: [ConfigModule],
  providers: [HttpService],
  exports: [HttpService]
})

export class HttpModule {}
