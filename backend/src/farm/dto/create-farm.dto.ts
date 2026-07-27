import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsLatitude, IsLongitude, IsOptional, IsPostalCode, IsString, MaxLength } from "class-validator";

export class CreateFarmDto {
    @ApiProperty({
        example: 'Gazdinstvo Mikic'
    })
    @IsString()
    @MaxLength(100)
    name!: string;

    @ApiPropertyOptional({
        example: '1234567890'
    })
    @IsOptional()
    @IsString()
    registrationNumber?: string;

    @ApiPropertyOptional({
        example: '987654321'
    })
    @IsOptional()
    @IsString()
    taxNumber?: string;

    @ApiProperty({
        example: 'Serbia'
    })
    @IsString()
    country!: string;
    
    @ApiProperty({
        example: 'Nis'
    })
    @IsString()
    city!: string;

    @ApiPropertyOptional({
        example: 'Donja Vrezina'
    })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({
        example: '18000'
    })
    @IsOptional()
    @IsPostalCode()
    postalCode?: string;

    @ApiPropertyOptional({
        example: 43.3209
    })
    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @ApiPropertyOptional({
        example: 21.8958
    })
    @IsOptional()
    @IsLongitude()
    longitude?: number;
}