import {
  IsDateString,
  IsOptional,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class UpgradeUpdateDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsDateString()
  @IsOptional()
  date: Date;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  place: string;
}
