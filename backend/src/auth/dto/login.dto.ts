import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
    @ApiProperty({
            example: 'mika@gmail.com'
        })
    @IsEmail()
    email!: string;

    @ApiProperty({
        example: 'Mika1234'
    })
    @IsString()
    password!: string;
}