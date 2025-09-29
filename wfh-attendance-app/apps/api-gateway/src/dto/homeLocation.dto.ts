import { IsNotEmpty, IsNumber } from 'class-validator';

export class HomeLocationDto {
  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;
}
