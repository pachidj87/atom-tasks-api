import { IsAlphanumeric, IsBoolean, IsDate, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class TaskDto {
  @ValidateIf((o) => o.id !== undefined)
  @IsString()
  @IsAlphanumeric()
  id?: string;

  @IsString()
  @IsAlphanumeric()
  ownerId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isCompleted: boolean;

  @ValidateIf((o) => o.createdAt !== undefined)
  @IsDate()
  createdAt?: any;

  @ValidateIf((o) => o.updatedAt !== undefined)
  @IsDate()
  updatedAt?: any;
}