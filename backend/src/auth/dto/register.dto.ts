import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class RegisterDto {
    @IsEmail()
    email!: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    username?: string;

    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName!: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName!: string;

    @IsOptional()
    @Matches(/^\+?[0-9]{8,15}$/)
    phone?: string;
}
