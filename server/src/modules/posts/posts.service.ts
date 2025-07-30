import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UserEntity } from 'src/entities/user.entity';
import { UpdatePostDto } from './dto/updata-post.dto';
import { TagEntity } from 'src/entities/tag.entity';
import { PostImageEntity } from 'src/entities/post-image.entity';
import { PostResponseDto } from './dto/response-post.dto';
import { CloudinaryService } from 'src/common/services/cloudinary.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,

        @InjectRepository(PostImageEntity)
        private readonly postImageRepository: Repository<PostImageEntity>,

        private readonly cloudinaryService: CloudinaryService
    ) { }

    // CREATE
    async createPost(
        userId: number,
        createPostDto: CreatePostDto,
        files: Express.Multer.File[]
    ): Promise<PostResponseDto> {
        try {
            const { tagIds } = createPostDto;
            const tags = await this.tagRepository.findByIds(tagIds || []);

            const newPost = await this.postRepository.create({
                ...createPostDto,
                tags: tags,
                user: { id: userId }
            });

            const savedPost = await this.postRepository.save(newPost);

            const imageUrls: string[] = [];
            for (const file of files) {
                const result = await this.cloudinaryService.uploadImage(file);
                imageUrls.push(result.secure_url);
            }

            const postImages = imageUrls.map(url => {
                return this.postImageRepository.create({ post: savedPost, imageUrl: url });
            });
            await this.postImageRepository.save(postImages);

            const fullPost = await this.postRepository.findOne({
                where: { id: savedPost.id },
                relations: ['user', 'tags', 'images'],
            });

            if (!fullPost) {
                throw new NotFoundException(`Bài viết với ID ${savedPost.id} không tồn tại`);
            }

            const res = new PostResponseDto(fullPost);

            return res;
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException('Tạo bài viết thất bại!');
        }
    }

    async getPostsByTag(tagId: number): Promise<PostResponseDto[]> {
        const tag = await this.tagRepository.findOne({
            where: { id: tagId },
            relations: ['posts', 'posts.user', 'posts.images', 'posts.tags'],
        });

        if (!tag) {
            throw new NotFoundException(`Tag với ID ${tagId} không tồn tại`);
        }

        return tag.posts.map(post => new PostResponseDto(post));
    }


    async getAllPost(): Promise<PostResponseDto[]> {
        const posts = await this.postRepository.find({
            order: {
                createdAt: 'DESC'
            },
            relations: ['user', 'tags', 'images']
        })
        return posts.map(post => new PostResponseDto(post));
    }

    async getPostDetails(id: number): Promise<PostResponseDto> {
        const post = await this.postRepository.findOne({
            where: { id: id },
            relations: ['user', 'tags', 'images']
        });
        if (!post) {
            throw new NotFoundException(`Bài viết với ID: ${id} không tồn tại`);
        }
        return new PostResponseDto(post);
    }

    async getPostsByUserId(userId: number): Promise<PostResponseDto[]> {
        const posts = await this.postRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'tags', 'images'],
            order: { createdAt: 'DESC' }
        })
        return posts.map(post => new PostResponseDto(post));
    }

    // UPDATE
    async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
        const existingPost = await this.postRepository.findOne({
            where: { id },
            relations: ['user', 'tags', 'images'],
        });
        if (!existingPost) {
            throw new NotFoundException(`Bài viết với ID: ${id} không tồn tại`);
        }

        if (updatePostDto.title) existingPost.title = updatePostDto.title;
        if (updatePostDto.content) existingPost.content = updatePostDto.content;

        if (updatePostDto.tagIds) {
            const tags = await this.tagRepository.findByIds(updatePostDto.tagIds);
            existingPost.tags = tags;
        }

        if (updatePostDto.imageUrls) {
            // xóa ảnh ũ
            await this.postImageRepository.delete({ post: { id: existingPost.id } });

            // Them ảnh mới
            const newImages = updatePostDto.imageUrls.map(url => {
                return this.postImageRepository.create({ imageUrl: url, post: existingPost });
            })
            const savedImages = await this.postImageRepository.save(newImages);

            existingPost.images = savedImages;
        }

        const updatedPost = await this.postRepository.save(existingPost);

        const result = await this.postRepository.findOne({
            where: { id: updatedPost.id },
            relations: ['user', 'tags', 'images'],
        });

        if (!result) {
            throw new NotFoundException();
        }

        const res = new PostResponseDto(result);
        return res;
    }

    async deletePost(id: number): Promise<void> {
        const existingPost = await this.postRepository.findOneBy({ id });
        if (!existingPost) {
            throw new NotFoundException(`Bài viết với ID: ${id} không tồn tại`);
        }
        await this.postRepository.remove(existingPost);
    }
}
