import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthenticationGuard } from './guards/jwtAuthentication.guard';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const { user, res } = request;

    const cookie = this.authenticationService.getCookieWithJwtToken(user);

    res.setHeader('Set-Cookie', cookie);

    return user;
  }

  @HttpCode(200)
  @Post('log-out')
  @UseGuards(JwtAuthenticationGuard)
  async logOut(@Req() request: Request) {
    request.res.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut(),
    );
  }
}
