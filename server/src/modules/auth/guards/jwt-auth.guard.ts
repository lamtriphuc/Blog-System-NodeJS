import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext) {
        const can = await super.canActivate(context);
        if (!can) return false;

        const request = context.switchToHttp().getRequest();
        const user = request.user; // payload JWT 

        // Lấy user từ DB
        const dbUser = await this.userRepository.findOne({ where: { id: user.id } });

        if (!dbUser) throw new UnauthorizedException('User không tồn tại');

        // Nếu user bị ban nhưng hết hạn => gỡ ban
        if (dbUser.isBanned && dbUser.bannedUntil && new Date() > dbUser.bannedUntil) {
            dbUser.isBanned = false;
            dbUser.bannedUntil = null;
            await this.userRepository.save(dbUser);
        }

        // Nếu user vẫn còn bị ban => chặn truy cập
        if (dbUser.isBanned) {
            throw new UnauthorizedException(
                `Bạn bị ban đến ${dbUser.bannedUntil?.toLocaleString()}`
            );
        }

        request.user = dbUser; // Gán lại để các controller có entity đầy đủ
        return true;
    }
}