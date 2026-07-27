import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "./user-response.dto";

export class LoginResponseDto {
    @ApiProperty()
    user!: UserResponseDto;
    @ApiProperty()
    accessToken!: string;
    @ApiProperty()
    refreshToken!: string;
}
