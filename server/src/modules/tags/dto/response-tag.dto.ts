import dayjs = require('dayjs')
import { TagEntity } from "src/entities/tag.entity";

export class TagResponseDto {
    id: number;
    name: string;
    description: string;
    posts: number[];
    totalPost: number;
    postToday: number;

    constructor(tag: TagEntity) {
        this.id = tag.id
        this.name = tag.name;
        this.description = tag.description;
        this.posts = tag.posts?.map(post => post.id);
        this.totalPost = tag.posts.length;

        const today = dayjs().startOf('day'); // 00:00 hôm nay
        this.postToday = tag.posts
            ?.filter(post => dayjs(post.createdAt).isAfter(today))
            ?.length;
    }
}