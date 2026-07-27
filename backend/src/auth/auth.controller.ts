import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/common/types/authenticated-user.type';
import { LogoutDto } from './dto/logout.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_AUTH_NAME } from 'src/common/constants/swagger.constant';

@ApiTags('Authentication')
@Controller({
    path: 'auth',
    version: '1',
})
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @ApiOperation({
        summary: 'Register new user'
    })
    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @ApiOperation({
        summary: 'Login'
    })
    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }
    
    @Post('refresh')
    refresh(@Body() dto: RefreshTokenDto) {
        return this.authService.refresh(dto);
    }

    @ApiBearerAuth(SWAGGER_AUTH_NAME)
    @ApiOperation({
        summary: 'Current user profile'
    })
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    profile(@CurrentUser() user: AuthenticatedUser) {
        return this.authService.profile(user);
    }

    @ApiOperation({
        summary: 'Logout'
    })
    @Post('logout')
    async logout(@Body() dto: LogoutDto) {
        await this.authService.logout(dto);

        return {
            message: 'Logged out successfully.'
        }
    }

    @ApiBearerAuth(SWAGGER_AUTH_NAME)
    @ApiOperation({
        summary: 'Logout from all devices'
    })
    @Post('logout-all')
    @UseGuards(JwtAuthGuard)
    async logoutAll(@CurrentUser() user: AuthenticatedUser) {
        await this.authService.logoutAll(user.id);

        return {
            message: 'Logged out from all devices.'
        }
    }
}
