import { Injectable, BadRequestException } from '@nestjs/common';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtSecret: JwtService,
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

        const { passwordHash: _, ...result } = user;

        return result;
    }

    login(dto: LoginDto) {

    }

    refresh(dto: RefreshTokenDto) {

    }

    profile() {
        
    }
}
