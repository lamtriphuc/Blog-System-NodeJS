import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from 'src/entities/comment.entity';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto } from './dto/response-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private readonly commentRepository: Repository<CommentEntity>,

        @InjectRepository(PostEntity)
        private readonly postRepository: Repository<PostEntity>,

        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) { }

    async createComment(userId: number, createCommentDto: CreateCommentDto): Promise<CommentResponseDto> {
        const user = await this.userRepository.findOne({
            where: { id: userId }
        })
        if (!user) {
            throw new NotFoundException('Người dùng không tồn tại');
        }
        const post = await this.postRepository.findOne({
            where: { id: createCommentDto.postId }
        })
        if (!post) {
            throw new NotFoundException('Bài viết không tồn tại');
        }

        const comment = await this.commentRepository.create({
            content: createCommentDto.content,
            user: user,
            post: post
        })
        await this.commentRepository.save(comment);

        const res = new CommentResponseDto(comment);

        return res;
    }

    async getCommentsByPost(postId: number): Promise<CommentResponseDto[]> {
        const comments = await this.commentRepository.find({
            where: { post: { id: postId } },
            relations: ['user'],
            order: { createdAt: 'DESC' }
        });

        const res = comments.map(comment => new CommentResponseDto(comment));
        return res;
    }

    async updateComment(userId: number, commentId: number, dto: UpdateCommentDto): Promise<CommentResponseDto> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) throw new NotFoundException('Không tìm thấy bình luận');

        if (comment.user.id !== userId) throw new ForbiddenException('Bạn không có quyền chỉnh sửa bình luận này');

        comment.content = dto.content;
        await this.commentRepository.save(comment);

        const res = new CommentResponseDto(comment);
        return res;
    }

    async deleteComment(userId: number, commentId: number): Promise<string> {
        const comment = await this.commentRepository.findOne({
            where: { id: commentId },
            relations: ['user'],
        });

        if (!comment) throw new NotFoundException('Không tìm thấy bình luận');

        if (comment.user.id !== userId) throw new ForbiddenException('Bạn không có quyền xóa bình luận này');

        await this.commentRepository.delete(commentId);
        return 'Xóa bình luận thành công';
    }
}
