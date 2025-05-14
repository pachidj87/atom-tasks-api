import { IsAlphanumeric, IsString, IsNotEmpty } from 'class-validator';

export class EntityIdParamDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  id: string;
}