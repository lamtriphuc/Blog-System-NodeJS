import { CreateUserDto } from "./create-user.dto";

export class UpdateUser {
    username: string;
    bio?: string;
    avatarUrl?: string;
}