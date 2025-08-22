import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { TagEntity } from "src/entities/tag.entity";
import { Repository } from "typeorm";
import { TagsService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { PostResponseDto } from "../posts/dto/response-post.dto";
import { PostsService } from "../posts/posts.service";
import { ResponseData } from "src/global/globalClass";
import { TagResponseDto } from "./dto/response-tag.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { AdminGuard } from "../auth/guards/admin.guard";

@Controller('api/tags')
export class TagController {
    constructor(
        private readonly tagService: TagsService,
        private readonly postsService: PostsService
    ) { }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async createTag(
        @Body() createTagDto: CreateTagDto
    ): Promise<any> {
        const newTag = this.tagService.createTag(createTagDto);
        return new ResponseData(newTag, HttpStatus.OK, 'Thêm thẻ thành công');
    }

    @Get()
    async getAllTagPaninate(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5
    ) {
        const tags = await this.tagService.getAllTagPaninate(page, limit);
        return new ResponseData(tags, HttpStatus.OK, 'Lấy tags thành công');
    }

    @Get('all-tag')
    async getAllTag() {
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
        @Param('tagId', ParseIntPipe) tagId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 5
    ) {
        const posts = await this.postsService.getPostsByTag(tagId, page, limit);
        return new ResponseData(posts, HttpStatus.OK, 'Lấy bài viết theo tag thành công!');
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async deleteReport(
        @Param('id') id: number
    ): Promise<ResponseData<null>> {
        await this.tagService.deleteTag(id);
        return new ResponseData(null, HttpStatus.OK, 'Xóa thẻ thành công');
    }
}