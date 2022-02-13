import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string | undefined;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName: string | undefined;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
