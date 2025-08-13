import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const { user } = context.switchToHttp().getRequest();

        if (!user) throw new ForbiddenException('Bạn chưa đăng nhập');

        // Không phải admin
        if (user.role !== 1) {
            throw new ForbiddenException('Bạn không có quyền truy cập');
        }

        return true;
    }
}