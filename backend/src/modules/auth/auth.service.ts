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
        const isMatch = bcrypt.compareSync(password, user.passwordHash);

        if (user && isMatch) {
            const { passwordHash, ...data } = user;
            return data;
        }
        return null;
    }

    async login(loginData: any) {
        const { email, id } = loginData;
        const payload = { email, sub: id };
        const refreshToken = await this.jwtService.sign(payload, {
            expiresIn: '7h'
        });
        this.userService.saveRefreshToken(id, refreshToken);
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: refreshToken
        };
    }

    async verifyRefreshToken(refreshToken: string) {
        const decoded = await this.jwtService.decode(refreshToken);
        if (decoded) {
            const user = this.userService.verifyRefreshToken(decoded.sub, refreshToken);
            if (user) {
                return user;
            }
        }
        return false;
    }
}
