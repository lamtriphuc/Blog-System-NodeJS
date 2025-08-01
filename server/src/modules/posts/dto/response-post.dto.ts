import { PostImageEntity } from "src/entities/post-image.entity";
import { PostEntity } from "src/entities/post.entity";
import { TagEntity } from "src/entities/tag.entity";

export class PostResponseDto {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    images: string[];
    user: {
        id: number;
        username: string;
        avatar: string;
    };
    upVoteCount: number;
    commentCount: number;

    constructor(post: PostEntity) {
        this.id = post.id;
        this.title = post.title;
        this.content = post.content;
        this.createdAt = post.createdAt;
        this.updatedAt = post.updatedAt;
        this.images = post.images?.map(img => img.imageUrl) || [];
        this.tags = post.tags?.map(tag => tag.name) || [];
        this.user = {
            id: post.user.id,
            username: post.user.username,
            avatar: post.user.avatarUrl
        };
        this.upVoteCount = post.votes?.filter(vote => vote.voteType === 1).length || 0;
        this.commentCount = post.comments?.length || 0;
    }
}
