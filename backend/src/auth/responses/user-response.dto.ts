export class UserResponseDto {
    id!: string;
    email!: string;
    username?: string | null;
    firstName!: string;
    lastName!: string;
    phone?: string | null;
    avatarUrl?: string | null;
    language!: string;
    timezone!: string;
    isEmailVerified!: boolean;
    isPhoneVerified!: boolean;
    createdAt!: Date;
}