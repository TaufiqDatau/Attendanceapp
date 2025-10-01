import {
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsDateString,
} from 'class-validator';

export class UpdateUserDto {
    @IsNotEmpty({ message: 'User ID is required.' })
    @IsNumber()
    id: number;

    @IsOptional()
    @IsString()
    first_name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    phone_number?: string;

    @IsOptional()
    @IsDateString()
    birth_date?: string;

    @IsOptional()
    @IsString()
    birth_place?: string;

    @IsOptional()
    @IsString()
    full_address?: string;

    @IsOptional()
    @IsNumber()
    home_latitude?: number;

    @IsOptional()
    @IsNumber()
    home_longitude?: number;
}