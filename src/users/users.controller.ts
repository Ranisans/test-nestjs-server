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
  Post,
} from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthenticationGuard } from 'authentication/guards/jwtAuthentication.guard';
import RequestWithUser from 'authentication/interfaces/requestWithUser.interface';
import { EMPTY_COOKIE } from 'constants/authentication';
import { AddImageDto } from './dto/add-image.dto';
import { EmailDto } from './dto/email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  @UseGuards(JwtAuthenticationGuard)
  update(
    @Req() request: RequestWithUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { user } = request;
    return this.usersService.update(user.id, updateUserDto);
  }

  @Patch('password')
  @UseGuards(JwtAuthenticationGuard)
  updatePassword(
    @Req() request: RequestWithUser,
    @Body() updateUserDto: UpdatePasswordDto,
  ) {
    const { user } = request;
    return this.usersService.updatePassword(user.id, updateUserDto);
  }

  @HttpCode(200)
  @Delete()
  @UseGuards(JwtAuthenticationGuard)
  remove(@Req() request: RequestWithUser) {
    const { user, res } = request;
    this.usersService.remove(user.id);
    res.setHeader('Set-Cookie', EMPTY_COOKIE);
  }

  @Post('update-image')
  @UseGuards(JwtAuthenticationGuard)
  updateImage(
    @Req() request: RequestWithUser,
    @Body() addImageDto: AddImageDto,
  ) {
    const {
      user: { id },
    } = request;
    return this.usersService.updateImage(id, addImageDto.imageUrl);
  }

  @Post('generate-pdf')
  @UseGuards(JwtAuthenticationGuard)
  generatePDF(@Req() request: Request, @Body() emailDto: EmailDto) {
    return this.usersService.generatePDF(emailDto.email);
  }

  @Get('/pdf')
  @UseGuards(JwtAuthenticationGuard)
  async getPdf(@Req() request: Request, @Body() emailDto: EmailDto) {
    const { res } = request;
    const pdf = await this.usersService.getPdf(emailDto.email);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${emailDto.email}.pdf`,
      'Content-Length': pdf.length,
    });

    res.end(pdf);
  }

  @Get(':id')
  @UseGuards(JwtAuthenticationGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
