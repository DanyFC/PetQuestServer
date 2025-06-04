import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateUpdateDto {
  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  place: string;

  @IsNotEmpty()
  @IsString()
  quest: string;
}
