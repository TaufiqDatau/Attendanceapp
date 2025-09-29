import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @Type(() => Number) // Transform the incoming query string to a number
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number) // Transform the incoming query string to a number
  @IsInt()
  @Min(1)
  // You could also add @Max(100) to limit the max results per page
  limit?: number = 10;
}
