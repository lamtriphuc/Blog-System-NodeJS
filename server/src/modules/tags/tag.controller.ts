import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { TagEntity } from "src/entities/tag.entity";
import { Repository } from "typeorm";
import { TagsService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { PostResponseDto } from "../posts/dto/response-post.dto";
import { PostsService } from "../posts/posts.service";
import { ResponseData } from "src/global/globalClass";
import { TagResponseDto } from "./dto/response-tag.dto";

@Controller('api/tags')
export class TagController {
    constructor(
        private readonly tagService: TagsService,
        private readonly postsService: PostsService
    ) { }

    @Post()
    async createTag(
        @Body() createTagDto: CreateTagDto
    ): Promise<any> {
        const newTag = this.tagService.createTag(createTagDto);
        return newTag;
    }

    @Get()
    async getAllTag(
    ): Promise<any> {
        const tags = await this.tagService.getAllTag();
        return new ResponseData(tags, HttpStatus.OK, 'Lấy tags thành công');
    }

    @Get('tag-trending')
    async getTrendingTags(): Promise<ResponseData<TagResponseDto[]>> {
        const tags = await this.tagService.getTrendingTags();
        return new ResponseData<TagResponseDto[]>(tags, HttpStatus.OK, 'Lấy tag trending thành công')
    }

    @Get('/:tagId')
    async getPostsByTag(
        @Param('tagId', ParseIntPipe) tagId: number
    ): Promise<ResponseData<PostResponseDto[]>> {
        const posts = await this.postsService.getPostsByTag(tagId);
        return new ResponseData<PostResponseDto[]>(posts, HttpStatus.OK, 'Lấy bài viết theo tag thành công!');
    }
}