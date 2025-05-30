import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

enum PetType {
  DOG = 'Perro',
  CAT = 'Gato',
  BIRD = 'Ave',
  FISH = 'Pez',
  RODENT = 'Roedor',
  REPTILE = 'Reptil',
}

enum Gender {
  MALE = 'Masculino',
  FEMALE = 'Femenino',
}

export class CreateQuestDto {
  @IsArray()
  characteristics: string[];

  @IsNotEmpty()
  @IsString()
  direction: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: string;

  @IsArray()
  health: string[];

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  race: string[];

  @IsString()
  story: string;

  @IsBoolean()
  trained: boolean;

  @IsNotEmpty()
  @IsEnum(PetType)
  type: string;

  @IsDateString()
  @IsNotEmpty()
  lostDate: Date;

  @IsString()
  @IsNotEmpty()
  placeOfLost: string;
}
