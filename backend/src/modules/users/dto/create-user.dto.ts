import { IsEmail, IsNotEmpty, Length, length, MinLength } from "class-validator";

export class CreateUserDto {
    @Length(4, 20, { message: 'Tên người dùng phải ít nhất 4 ký tự, tối đa 20' })
    @IsNotEmpty({ message: 'Tên người dùng không được bỏ trống' })
    username: string;

    @IsEmail({}, { message: 'Phải nhập đúng định dạng Email' })
    @IsNotEmpty({ message: 'Email không được bỏ trống' })
    email: string;

    @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
    @MinLength(6, { message: 'Phải ít nhắt 6 ký tự' })
    password: string;
}