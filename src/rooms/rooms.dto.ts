import { IsString, IsNumber, MinLength, MaxLength, IsOptional, IsDateString } from "class-validator";

export class EditRoomDto{
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    name: string

    @IsOptional()
    @IsNumber()
    price: number

    @IsOptional()
    @IsNumber()
    capacity: number
}
export class CreateRoomDto{
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    name: string

    @IsNumber()
    price: number

    @IsNumber()
    capacity: number
}

export class AvailabilityDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}