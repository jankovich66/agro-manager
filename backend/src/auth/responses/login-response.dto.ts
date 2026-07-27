import { UserResponseDto } from "./user-response.dto";

export class LoginResponseDto {
    user!: UserResponseDto;
    accessToken!: string;
    refreshToken!: string;
}
