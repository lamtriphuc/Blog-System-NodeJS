import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PostEntity } from "src/entities/post.entity";
import { SavedPostEntity } from "src/entities/saved-post.entity";
import { Repository } from "typeorm";
import { PostResponseDto } from "../posts/dto/response-post.dto";

@Injectable()
export class SavePostService {
    constructor(
        @InjectRepository(SavedPostEntity)
        private readonly savePostRepository: Repository<SavedPostEntity>,

        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>
    ) { }

    async savePost(userId: number, postId: number): Promise<any> {
        const exists = await this.savePostRepository.findOneBy({ userId, postId });
        if (exists) {
            await this.savePostRepository.delete({ userId, postId });
            return 'Đã bỏ lưu bài viết';
        }

        const post = await this.postRepository.findOneBy({ id: postId });
        if (!post) {
            throw new NotFoundException('Bài viết này không tồn tại');
        }

        const saved = this.savePostRepository.create({ userId, postId });
        await this.savePostRepository.save(saved);
        return 'Đã lưu';
    }

    async unsavePost(userId: number, postId: number): Promise<any> {
        const result = await this.savePostRepository.delete({ userId, postId });
        if (result.affected === 0) {
            throw new NotFoundException('Bài viết chưa đc lưu');
        }
        return 'Đã bỏ lưu bài viết';
    }

    async getSavedPosts(userId: number): Promise<PostResponseDto[]> {
        const savedPosts = await this.savePostRepository.find({
            where: { userId },
            relations: ['post', 'post.user', 'post.images', 'post.tags'],
            order: { createdAt: 'DESC' }
        })

        return savedPosts.map(savePost => new PostResponseDto(savePost.post));
    }
}