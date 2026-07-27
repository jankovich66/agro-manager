import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
    @ApiProperty()
    id!: string;
    @ApiProperty()
    email!: string;
    @ApiProperty()
    username?: string | null;
    @ApiProperty()
    firstName!: string;
    @ApiProperty()
    lastName!: string;
    @ApiProperty()
    phone?: string | null;
    @ApiProperty()
    avatarUrl?: string | null;
    @ApiProperty()
    language!: string;
    @ApiProperty()
    timezone!: string;
    @ApiProperty()
    isEmailVerified!: boolean;
    @ApiProperty()
    isPhoneVerified!: boolean;
    @ApiProperty()
    createdAt!: Date;
}