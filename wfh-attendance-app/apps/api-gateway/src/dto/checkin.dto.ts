import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CheckInDto {
  @IsNotEmpty()
  @IsNumberString()
  latitude: string; // Received as a string in multipart/form-data

  @IsNotEmpty()
  @IsNumberString()
  longitude: string; // Received as a string in multipart/form-data
}
