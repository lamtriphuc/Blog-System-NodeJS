import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto {
    username: string;
    bio?: string;
    avatarUrl?: string;
}