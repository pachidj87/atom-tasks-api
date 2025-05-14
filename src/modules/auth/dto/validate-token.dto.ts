import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';

export class ValidateTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}