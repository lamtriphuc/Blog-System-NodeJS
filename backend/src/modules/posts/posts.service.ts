import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) { }

    async getAllPost(): Promise<PostEntity[]> {
        const posts = this.postRepository.find({
            order: {
                createdAt: 'DESC'
            }
        })
        return posts;
    }

    async createPost(createPostDto: CreatePostDto): Promise<PostEntity> {
        try {
            const { userId, ...data } = createPostDto;

            const newPost = await this.postRepository.create({
                ...data,
                user: { id: userId } as UserEntity
            });

            return this.postRepository.save(newPost);
        } catch (error) {
            throw new InternalServerErrorException('Tạo bài viết thất bại!');
        }
    }
}
