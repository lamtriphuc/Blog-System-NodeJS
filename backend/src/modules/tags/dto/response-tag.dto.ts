import { TagEntity } from "src/entities/tag.entity";

export class TagResponseDto {
    name: string;
    description: string;
    posts: number[];

    constructor(tag: TagEntity) {
        this.name = tag.name;
        this.description = tag.description;
        this.posts = tag.posts?.map(post => post.id);
    }
}