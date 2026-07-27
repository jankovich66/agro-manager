import { ApiProperty } from "@nestjs/swagger";

export class FarmListItemDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    city!: string;

    @ApiProperty()
    country!: string;

    @ApiProperty()
    memberRole!: string;

    @ApiProperty()
    fieldCount!: number;

    @ApiProperty()
    totalArea!: number;
}