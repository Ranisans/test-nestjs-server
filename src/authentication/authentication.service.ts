import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'users/users.service';
import { CreateUserDto } from 'users/dto/create-user.dto';
import { ROUNDS } from 'constants/authentication';
import PostgresErrorCode from 'constants/postgresErrorCodes.enum';
import User from 'database/entities/user.entity';
import TokenPayload from './interfaces/tokenPayload.interface';
import {
  INTERNAL_SERVER_ERROR,
  USER_WITH_THAT_EMAIL_ALREADY_EXISTS,
  WRONG_CREDENTIALS_PROVIDED,
} from 'constants/api';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registrationData: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, ROUNDS);

    try {
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          USER_WITH_THAT_EMAIL_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getCookieWithJwtToken(user: User) {
    const payload: TokenPayload = { userId: user.id };

    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; MaxAge=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);

      await this.verifyPassword(password, user.password);

      return user;
    } catch (error) {
      throw new HttpException(
        WRONG_CREDENTIALS_PROVIDED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatch) {
      throw new HttpException(
        WRONG_CREDENTIALS_PROVIDED,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
