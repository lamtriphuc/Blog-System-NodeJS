import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export default class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        const isMatch = user && await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return null;
        const { passwordHash, ...result } = user;
        return result;
    }

    async login(loginData: any) {
        const { email, id } = loginData;
        const payload = { email, sub: id };

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        await this.userService.saveRefreshToken(id, refreshToken);
        return { accessToken, refreshToken };
    }

    async verifyRefreshToken(refreshToken: string) {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken);
            const user = await this.userService.verifyRefreshToken(decoded.sub, refreshToken);
            if (!user) return null;
            return user;
        } catch (e) {
            return null;
        }
    }

    async logout(refreshToken: string) {
        try {
            const decoded = await this.jwtService.verifyAsync(refreshToken);
            await this.userService.removeRefreshToken(decoded.sub);
        } catch (err) {
            // token không hợp lệ, vẫn xóa cookie bên FE
            return;
        }
    }


    async getProfile(user: any): Promise<any> {
        const { passwordHash, refreshToken, ...data } = user;
        return data;
    }
}
