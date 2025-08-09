import dayjs = require('dayjs')
import { filter } from 'rxjs';
import { TagEntity } from "src/entities/tag.entity";

export class TagResponseDto {
    id: number;
    name: string;
    description: string;
    posts: number[];
    totalPost: number;
    postToday: number;
    postThisMonth: number;

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

        const startOfMonth = dayjs().startOf('month');
        this.postThisMonth = tag.posts
            ?.filter(post => dayjs(post.createdAt).isAfter(startOfMonth))
            ?.length || 0;
    }
}