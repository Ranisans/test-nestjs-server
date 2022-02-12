import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  HttpCode,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthenticationGuard } from 'authentication/guards/jwtAuthentication.guard';
import RequestWithUser from 'authentication/interfaces/requestWithUser.interface';
import { EMPTY_COOKIE } from 'constants/authentication';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @Patch()
  @UseGuards(JwtAuthenticationGuard)
  update(
    @Req() request: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { user } = request;
    return this.usersService.update(user.id, updateUserDto);
  }

  @HttpCode(200)
  @Delete()
  @UseGuards(JwtAuthenticationGuard)
  remove(@Req() request: RequestWithUser) {
    const { user, res } = request;
    this.usersService.remove(user.id);
    res.setHeader('Set-Cookie', EMPTY_COOKIE);
  }
}
