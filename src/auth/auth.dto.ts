import { IsString, IsEmail, MinLength, MaxLength } from "class-validator"

export class RegisterDto {
    @IsString()
    @MinLength(3)
    @MaxLength(55)
    name: string

    @IsString()
    @MinLength(6)
    @MaxLength(55)
    password: string

    @IsEmail()
    email: string
}
export class LoginDto {
    @IsString()
    name: string

    @IsString()
    password: string

    
}