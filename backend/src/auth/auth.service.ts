import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';
import { UserMapper } from './mappers/user.mapper';
import { AuthenticatedUser } from 'src/common/types/authenticated-user.type';
import { RefreshTokenPaylaod } from './types/refresh-payload.type';
import { LoginResponseDto } from './responses/login-response.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async register(dto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });

        if(existingUser) {
            throw new BadRequestException('User with this email already exists.');
        }

        const passwordHash = await bcrypt.hash(dto.password, 12);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                username: dto.username,
                phone: dto.phone
            }
        });

        //const { passwordHash: _, ...result } = user;

        return UserMapper.toResponse(user);
    }

    async login(dto: LoginDto) {
        const user = await this.validateUser(dto.email, dto.password);

        const accessToken = await this.generateAccessToken(user.id);

        const refreshToken = await this.generateRefreshToken(user.id);

        await this.saveRefreshToken(user.id, refreshToken);

        await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                lastLoginAt: new Date()
            }
        });

        return {
            user: UserMapper.toResponse(user),
            accessToken,
            refreshToken
        }
    }

    async refresh(dto: RefreshTokenDto): Promise<LoginResponseDto> {
        const payload = await this.verifyRefreshToken(dto.refreshToken);

        const storedToken = await this.findMatchingRefreshToken(payload.sub, dto.refreshToken);

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
                isActive: true,
                deletedAt: null
            }
        });

        if(!user) {
            throw new UnauthorizedException();
        }

        await this.prisma.refreshToken.delete({
            where: {
                id: storedToken.id
            }
        });

        const newAccessToken = await this.generateAccessToken(user.id);

        const newRefreshToken = await this.generateRefreshToken(user.id);

        await this.saveRefreshToken(user.id, newRefreshToken);

        return {
            user: UserMapper.toResponse(user),
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    profile(user: AuthenticatedUser) {
        return user;
    }

    async logout(dto: LogoutDto): Promise<void> {
        const payload = await this.verifyRefreshToken(dto.refreshToken);

        const stored = await this.findMatchingRefreshToken(payload.sub, dto.refreshToken);

        await this.prisma.refreshToken.delete({
            where: {
                id: stored.id
            }
        });
    }

    async logoutAll(userId: string): Promise<void> {
        await this.prisma.refreshToken.deleteMany({
            where: {
                userId
            }
        });
    }

    private async generateAccessToken(userId: string) {
        return this.jwtService.signAsync({
            sub: userId,
        });
    }

    private async generateRefreshToken(userId: string) {
        return this.jwtService.signAsync(
            {
                sub: userId,
            },
            {
                secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET') as any,
                expiresIn: this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRATION') as any
            }
        )
    }

    private async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if(!user) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if(!passwordMatches) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        return user;
    }

    private async saveRefreshToken(userId: string, refreshToken: string, ipAddress?: string, userAgent?: string) {
        const tokenHash = await bcrypt.hash(refreshToken, 12);

        const expiresAt = this.calculateRefreshExpiration();

        await this.prisma.refreshToken.create({
            data: {
                userId,
                tokenHash,
                expiresAt,
                ipAddress,
                userAgent
            }
        })
    }

    private calculateRefreshExpiration(): Date {
        const expiresAt = new Date();

        expiresAt.setDate(expiresAt.getDate() + 30);

        return expiresAt;
    }

    private async verifyRefreshToken(refreshToken: string): Promise<RefreshTokenPaylaod> {
        try {
            return await this.jwtService.verifyAsync<RefreshTokenPaylaod>(refreshToken, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET')
            });
        }
        catch {
            throw new UnauthorizedException('Invalid refresh token.');
        }
    }

    private async findMatchingRefreshToken(userId: string, refreshToken: string) {
        const tokens = await this.prisma.refreshToken.findMany({
            where: {
                userId,
                revokedAt: null,
                expiresAt: {
                    gt: new Date()
                }
            }
        });

        for(const token of tokens) {
            const matches = await bcrypt.compare(refreshToken, token.tokenHash);
        
            if(matches) {
                return token;
            }
        }

        throw new UnauthorizedException('Refresh token not found.');
    }
}
