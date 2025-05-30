import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateUpdateDto {
  @IsDateString()
  @IsNotEmpty()
  dateUpdate: Date;

  @IsNotEmpty()
  @IsString()
  descriptionUpdate: string;

  @IsNotEmpty()
  @IsString()
  placeUpdate: string;

  @IsNotEmpty()
  @IsString()
  quest: string;
}
