import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

@Injectable()
export class BanGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // user đã được JwtStrategy.validate trả về

        if (user?.isBanned) {
            throw new ForbiddenException(
                `Tài khoản của bạn đang bị khóa đến ${user.bannedUntil?.toLocaleString() || 'không xác định'}`
            );
        }

        return true;
    }
}
