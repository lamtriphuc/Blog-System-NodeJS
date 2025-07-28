import { BadRequestException, Body, Controller, Get, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import AuthService from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user);
    }

    @Post('refresh-token')
    refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
        if (!refreshToken) {
            throw new BadRequestException('Không có Refresh Token');
        }
        const user = this.authService.verifyRefreshToken(refreshToken);
        if (!user) {
            throw new UnauthorizedException('Refresh Token không hợp lệ');
        }
        return this.authService.login(user);
    }
}
