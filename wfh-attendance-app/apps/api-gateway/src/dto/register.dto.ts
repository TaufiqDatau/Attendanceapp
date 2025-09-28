// src/auth/dto/register.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  MinLength,
  isNotEmpty,
  isString,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty({ message: 'Phone number is required.' })
  readonly phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  readonly birthPlace: string;

  @IsString()
  @IsNotEmpty()
  readonly birthDate: string;

  @IsString()
  @IsNotEmpty()
  readonly fullAddress: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  readonly password: string;

  constructor(partial: Partial<RegisterDto> = {}) {
    Object.assign(this, partial);
  }
}
