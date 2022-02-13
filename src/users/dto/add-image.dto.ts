import { IsString, IsNotEmpty } from 'class-validator';
export class AddImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
