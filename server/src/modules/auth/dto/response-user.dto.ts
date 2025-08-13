import { UserEntity } from "src/entities/user.entity";

export class ResponseUser {
    id: number;
    email: string;
    username: string;
    role: number;

    constructor(user: UserEntity) {
        this.id = user.id;
        this.email = user.email;
        this.username = user.username;
        this.role = user.role;
    }
}