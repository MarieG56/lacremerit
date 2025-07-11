import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string; 

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  password: string;
}
