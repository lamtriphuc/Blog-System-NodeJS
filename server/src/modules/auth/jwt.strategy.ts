import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersService } from "../users/users.service";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private readonly userService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('SECRET_KEY') as string,
        });
    }

    async validate(payload: any) {
        const user = await this.userService.findByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException('User không tồn tại');
        }

        if (user.isBanned && user.bannedUntil && new Date() > user.bannedUntil) {
            // hết hạn ban → gỡ ban
            user.isBanned = false;
            user.bannedUntil = null;
            await this.userService.save(user);
        }

        return user;
    }
}