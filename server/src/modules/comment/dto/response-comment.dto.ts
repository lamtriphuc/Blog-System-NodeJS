import { CommentEntity } from "src/entities/comment.entity";

export class CommentResponseDto {
    id: number;
    user: {
        id: number;
        username: string
    };
    // post: { id: number } | null;
    content: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(comment: CommentEntity) {
        this.id = comment.id;
        this.user = {
            id: comment.user.id,
            username: comment.user.username
        };
        // this.post = comment.post ? { id: comment.post.id } : null;
        this.content = comment.content;
        this.createdAt = comment.createdAt;
        this.updatedAt = comment.updatedAt;
    }
}