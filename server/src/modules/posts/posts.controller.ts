import { Body, Controller, Get, Post, HttpStatus, Param, ParseIntPipe, Put, Delete, Req, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ResponseData } from 'src/global/globalClass';
import { PostEntity } from 'src/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/updata-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostResponseDto } from './dto/response-post.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  async createPost(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPostDto: CreatePostDto,
    @Request() req: any
  ): Promise<ResponseData<PostResponseDto>> {
    const userId = req.user.id;
    const post = await this.postsService.createPost(userId, createPostDto, files);
    return new ResponseData(post, HttpStatus.CREATED, 'Tạo bài viết thành công!');
  }

  @Get()
  async getAllPost(): Promise<ResponseData<PostResponseDto[]>> {
    const posts = await this.postsService.getAllPost();
    return new ResponseData<PostResponseDto[]>(posts, HttpStatus.OK, 'Lấy bài viết thành công!');
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user')
  async getPostsByUserId(
    @Request() req: any
  ) {
    const userId = req.user.id;
    const posts = await this.postsService.getPostsByUserId(userId);
    return new ResponseData<PostResponseDto>(posts, HttpStatus.OK, 'Lấy bài viết của User');
  }

  @Get('/:id')
  async getPostDetails(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ResponseData<PostResponseDto>> {
    const post = await this.postsService.getPostDetails(id);
    return new ResponseData<PostResponseDto>(post, HttpStatus.OK, 'Lấy bài viết thành công');
  }


  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto
  ): Promise<ResponseData<PostResponseDto>> {
    const post = await this.postsService.updatePost(id, updatePostDto);
    return new ResponseData(post, HttpStatus.OK, 'Cập nhật bài viết thành công');
  }

  @Delete('/:id')
  async deletePost(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ResponseData<void>> {
    await this.postsService.deletePost(id);
    return new ResponseData<void>(null, HttpStatus.OK, 'Xóa bài viết thành công');
  }
}
