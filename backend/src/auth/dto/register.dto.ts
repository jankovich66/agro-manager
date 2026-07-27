import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
export class RegisterDto {
    @ApiProperty({
        example: 'mika@gmail.com'
    })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'mika123'
    })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    username?: string;

    @ApiProperty({
        example: 'Mika1234'
    })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    password!: string;

    @ApiProperty({
        example: 'Mika'
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName!: string;

    @ApiProperty({
        example: 'Mikic'
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName!: string;

    @ApiProperty({
        example: '060123456'
    })
    @IsOptional()
    @Matches(/^\+?[0-9]{8,15}$/)
    phone?: string;
}
