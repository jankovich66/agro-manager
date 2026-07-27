import { User } from "@prisma/client";
import { UserResponseDto } from "../responses/user-response.dto";

export class UserMapper {
    static toResponse(user: User): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatarUrl: user.avatarUrl,
            language: user.language,
            timezone: user.timezone,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
            createdAt: user.createdAt,
        }
    }
}
