import { Controller, Post, HttpStatus, Body, Res } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { LoginControllerRequest, LoginControllerResponse } from './interfaces/controller';

@Controller('authentication')
export class AuthenticationController {

  constructor(private readonly authenticationService: AuthenticationService) {
  }

  @Post('login')
  async login(@Body() body: LoginControllerRequest, @Res() response) {

    let result = await this.authenticationService.login(body.username, body.password);

    if (result.error) {
      response.status(HttpStatus.OK)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(result);
    }
    else {
      let responseData: LoginControllerResponse = { ...result };
      response.status(HttpStatus.OK)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send(responseData);
    }
  }


}
