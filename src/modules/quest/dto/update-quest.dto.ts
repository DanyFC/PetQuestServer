import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Femenino',
}

export class UpdateQuestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsArray()
  @IsOptional()
  characteristics: string[];

  @IsString()
  @IsOptional()
  direction: string;

  @IsEnum(Gender)
  @IsOptional()
  gender: string;

  @IsArray()
  @IsOptional()
  health: string[];

  @IsString()
  @IsOptional()
  name: string;

  @IsArray()
  @IsOptional()
  race: string[];

  @IsString()
  @IsOptional()
  story: string;

  @IsBoolean()
  @IsOptional()
  trained: boolean;

  @IsDateString()
  @IsOptional()
  lostDate: Date;

  @IsString()
  @IsOptional()
  placeOfLost: string;

  @IsDateString()
  @IsOptional()
  foundedDate: Date;

  @IsDateString()
  @IsOptional()
  lastSeen: Date;
}
