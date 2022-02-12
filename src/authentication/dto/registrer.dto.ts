import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

import { PASSWORD_MIN_LENGTH } from 'constants/authentication';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;
}
