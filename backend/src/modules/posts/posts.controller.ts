import { Body, Controller, Get, Post, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ResponseData } from 'src/global/globalClass';
import { PostEntity } from 'src/entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  async getAllPost(): Promise<ResponseData<PostEntity[]>> {
    const posts = await this.postsService.getAllPost();
    return new ResponseData<PostEntity[]>(posts, HttpStatus.OK, 'Lấy bài viết thành công!');
  }

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto
  ): Promise<ResponseData<PostEntity>> {
    const post = await this.postsService.createPost(createPostDto);
    return new ResponseData(post, HttpStatus.CREATED, 'Tạo bài viết thành công!');
  }
}
