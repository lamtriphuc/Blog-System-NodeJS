import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {
    @IsEmail({}, { message: 'Phải là Email' })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    password: string;
}