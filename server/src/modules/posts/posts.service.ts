import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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


    async getAllPost(page: number, limit: number) {
        const [posts, total] = await this.postRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {
                createdAt: 'DESC'
            },
            relations: ['user', 'tags', 'images', 'votes', 'comments']
        })
        const res = posts.map(post => new PostResponseDto(post));
        return {
            posts: res,
            total,
            page,
            limit,
            totalPage: Math.ceil(total / limit),
        };
    }

    async getPostDetails(id: number): Promise<PostResponseDto> {
        const post = await this.postRepository.findOne({
            where: { id: id },
            relations: ['user', 'tags', 'images', 'votes', 'comments']
        });
        if (!post) {
            throw new NotFoundException(`Bài viết với ID: ${id} không tồn tại`);
        }
        return new PostResponseDto(post);
    }

    async getPostsByUserId(userId: number): Promise<PostResponseDto[]> {
        const posts = await this.postRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'tags', 'images', 'votes'],
            order: { createdAt: 'DESC' }
        })
        return posts.map(post => new PostResponseDto(post));
    }

    // UPDATE
    async updatePost(
        userId: number,
        postId: number,
        updatePostDto: UpdatePostDto,
        files: Express.Multer.File[]
    ): Promise<PostResponseDto> {
        const existingPost = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user', 'tags', 'images'],
        });

        if (!existingPost) {
            throw new NotFoundException(`Bài viết với ID: ${postId} không tồn tại`);
        }
        if (existingPost.user.id !== userId) {
            throw new ForbiddenException('Bạn không có quyền sửa bài viết này');
        }

        // Update title, content
        if (updatePostDto.title) existingPost.title = updatePostDto.title;
        if (updatePostDto.content) existingPost.content = updatePostDto.content;

        // Update tags
        if (updatePostDto.tagIds) {
            const tags = await this.tagRepository.findByIds(updatePostDto.tagIds);
            existingPost.tags = tags;
        }

        // Nếu có ảnh mới
        if (files && files.length > 0) {
            // Xóa ảnh cũ khỏi Cloudinary
            for (const img of existingPost.images) {
                const publicId = this.cloudinaryService.getPublicId(img.imageUrl);
                if (publicId) await this.cloudinaryService.deleteImage(publicId);
            }

            // Xóa ảnh cũ khỏi DB
            if (existingPost.images.length > 0) {
                await this.postImageRepository.remove(existingPost.images);
            }

            // Upload ảnh mới
            const newImageUrls: string[] = [];
            for (const file of files) {
                const result = await this.cloudinaryService.uploadImage(file);
                newImageUrls.push(result.secure_url);
            }

            // Tạo PostImage entity
            const postImages = newImageUrls.map(url =>
                this.postImageRepository.create({ imageUrl: url, post: existingPost })
            );

            // Lưu ảnh mới vào DB
            await this.postImageRepository.save(postImages);

            // Gán lại để trả về kết quả
            existingPost.images = postImages;
        }

        // Lưu post + ảnh
        const updatedPost = await this.postRepository.save(existingPost);

        // Lấy lại dữ liệu đầy đủ
        const result = await this.postRepository.findOne({
            where: { id: updatedPost.id },
            relations: ['user', 'tags', 'images'],
        });

        return new PostResponseDto(result!);
    }


    async deletePost(postId: number, user: any): Promise<void> {
        console.log(user)
        const existingPost = await this.postRepository.findOne({
            where: { id: postId },
            relations: ['user']
        })
        if (!existingPost) {
            throw new NotFoundException(`Bài viết với ID: ${postId} không tồn tại`);
        }

        // Nếu user không phải là tác giả và không phải admin thì chặn
        if (existingPost.user.id !== user.id && user.role !== 1) {
            throw new ForbiddenException('Bạn không có quyền xoá bài viết này');
        }
        await this.postRepository.remove(existingPost);
    }
}
