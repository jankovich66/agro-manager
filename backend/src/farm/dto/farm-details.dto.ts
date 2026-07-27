import { ApiProperty } from "@nestjs/swagger";

export class FarmDetailsDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({ nullable: true })
    registrationNumber?: string | null;

    @ApiProperty({ nullable: true })
    taxNumber?: string | null;

    @ApiProperty()
    country!: string;

    @ApiProperty()
    city!: string;

    @ApiProperty({ nullable: true })
    address?: string | null;

    @ApiProperty({ nullable: true })
    postalCode?: string | null;

    @ApiProperty({ nullable: true })
    latitude?: number | null;

    @ApiProperty({ nullable: true })
    longitude?: number | null;

    @ApiProperty()
    status!: string;

    @ApiProperty()
    memberCount!: number;

    @ApiProperty()
    fieldCount!: number;

    @ApiProperty()
    totalArea!: number;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}