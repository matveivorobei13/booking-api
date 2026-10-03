import { IsNumber, IsDateString } from "class-validator";

export class CreateBookingDto{
    @IsDateString()
    from: string

    @IsDateString()
    to: string

    @IsNumber()
    roomId: number
}
    
