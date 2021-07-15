import { Module, Global } from '@nestjs/common';
import { LoginService } from './login.service';
import { ConfigModule } from '../../../config/config.module';
import { HttpModule } from '../http/http.module';

@Global()
@Module({
  imports: [HttpModule, ConfigModule],
  providers: [LoginService],
  exports: [LoginService]
})

export class LoginModule {}
