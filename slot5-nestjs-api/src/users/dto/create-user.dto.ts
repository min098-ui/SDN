import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'student@fpt.edu.vn', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Nguyen Van A', description: 'User display name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'USER', description: 'User role', required: false, default: 'USER' })
  @IsString()
  @IsOptional()
  role?: string;
}
