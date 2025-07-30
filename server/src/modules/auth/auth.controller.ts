import { BadRequestException, Body, Controller, Get, HttpStatus, Post, Req, Request, Res, UnauthorizedException, UseGuards, ValidationPipe } from '@nestjs/common';
import AuthService from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { ResponseData } from 'src/global/globalClass';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Request() req: any,
        @Res({ passthrough: true }) res
    ) {
        const { accessToken, refreshToken } = await this.authService.login(req.user);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
        });

        // return { access_token: accessToken };
        return new ResponseData({ access_token: accessToken }, HttpStatus.OK, 'Đăng nhập thành công');
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user);
    }

    @Post('refresh-token')
    async refreshToken(@Req() req, @Res() res) {
        const token = req.cookies['refreshToken'];
        if (!token) {
            throw new BadRequestException('Missing refresh token');
        }

        const user = await this.authService.verifyRefreshToken(token);
        if (!user) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const { accessToken, refreshToken: newRefreshToken } = await this.authService.login(user);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/api/auth/refresh-token',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { access_token: accessToken };
    }

    @Post('logout')
    async logout(@Request() req: any, @Res({ passthrough: true }) res) {
        const refreshToken = req.cookies['refreshToken'];
        if (refreshToken) {
            await this.authService.logout(refreshToken);
        }

        // Xoá cookie phía FE
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/api/auth/refresh-token',
        });

        return { message: 'Logout successful' };
    }

}
