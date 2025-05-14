import { IsEmail, IsString, MinLength } from 'class-validator';
import { ValidateEmailDto } from './validate-email.dto';

export class AuthDto extends ValidateEmailDto {
  @IsString()
  @MinLength(6)
  password?: string;
}