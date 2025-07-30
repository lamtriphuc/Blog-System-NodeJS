import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { LoginDto } from "../dto/login.dto";

@Injectable()
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        // Validate DTO trước
        const loginDto = plainToInstance(LoginDto, req.body);
        const errors = await validate(loginDto);

        if (errors.length > 0) {
            for (const err of errors) {
                if (err.constraints) {
                    const message = Object.values(err.constraints)[0];
                    throw new BadRequestException(message);
                }
            }
        }

        // Nếu hợp lệ thì tiếp tục gọi canActivate() gốc
        return super.canActivate(context) as Promise<boolean>;
    }
}