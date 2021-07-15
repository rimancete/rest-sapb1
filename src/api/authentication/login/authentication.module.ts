import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { LoginModule } from '../../../core/b1/service-layer/login/login.module';

@Module({
	imports: [LoginModule],
	providers: [AuthenticationService],
	controllers: [AuthenticationController]
})
export class AuthenticationModule { }
