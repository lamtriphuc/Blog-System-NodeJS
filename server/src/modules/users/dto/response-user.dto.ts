import { UserEntity } from "src/entities/user.entity";

export class ResponseUserDto {
    id: number;
    username: string;
    email: string;
    bio: string;
    avatarUrl: string;
    role: number;
    createdAt: Date;
    isBanned: boolean;
    bannedUntil: Date | null;
    countPost: number;
    countComment: number;

    constructor(user: UserEntity) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.bio = user.bio;
        this.avatarUrl = user.avatarUrl;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.countPost = user.posts?.length || 0;
        this.countComment = user.comments?.length || 0;
        this.bannedUntil = user.bannedUntil;
        this.isBanned = user.isBanned;
    }
}