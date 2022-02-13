import { IsString, IsNotEmpty, MinLength } from 'class-validator';

import { PASSWORD_MIN_LENGTH } from 'constants/authentication';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  password: string;
}
