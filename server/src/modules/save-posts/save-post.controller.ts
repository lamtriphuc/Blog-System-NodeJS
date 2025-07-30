import { Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Request, UseGuards } from "@nestjs/common";
import { SavePostService } from "./save-post.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ResponseData } from "src/global/globalClass";

@Controller('api/save-posts')
@UseGuards(JwtAuthGuard)
export class SavePostController {
    constructor(
        private readonly savePostService: SavePostService
    ) { }

    @Post('/:postId')
    async savePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Request() req: any
    ) {
        const userId = req.user.id;
        const message = await this.savePostService.savePost(userId, postId);
        return new ResponseData(null, HttpStatus.CREATED, message);
    }

    @Delete('/:postId')
    async unsavePost(
        @Param('postId', ParseIntPipe) postId: number,
        @Request() req: any
    ) {
        const userId = req.user.id;
        const message = await this.savePostService.unsavePost(userId, postId);
        return new ResponseData(null, HttpStatus.OK, message);
    }


    @Get()
    async getSavedPosts(
        @Request() req: any
    ) {
        const userId = req.user.id;
        const posts = await this.savePostService.getSavedPosts(userId);
        return new ResponseData(posts, HttpStatus.OK, 'Lấy bài viết đã lưu thành công');
    }
}