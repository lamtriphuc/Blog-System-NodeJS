import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VoteEntity } from 'src/entities/vote.entity';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/entities/post.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ResponseVoteDto } from './dto/response-vote.dto';
import { NotificationsService } from '../notification/notification.service';
import { NotificationsGateway } from '../notification/notifications.gateway';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(VoteEntity)
    private readonly voteRepository: Repository<VoteEntity>,

    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private readonly notificationService: NotificationsService,
    private readonly notificationGateway: NotificationsGateway
  ) { }

  async vote(userId: number, { postId, voteType }: CreateVoteDto): Promise<string> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user']
    })
    if (!post) {
      throw new NotFoundException('Bài viết không tồn tại');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId }
    })
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    const existingVote = await this.voteRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } }
    })

    if (post.user.id !== userId) {
      await this.notificationService.createNotification(
        post.user.id, // chủ post
        'vote',
        post.id,
        `${user.username} đã vote bài viết của bạn`
      )

      // real time
      this.notificationGateway.sendToUser(
        post.user.id,
        { message: `${user.username} đã vote bài viết của bạn` }
      );
    }


    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await this.voteRepository.remove(existingVote);
        return 'Bỏ vote thành công';
      }

      existingVote.voteType = voteType;
      await this.voteRepository.save(existingVote);
      return 'Cập nhật vote thành công';
    }


    const newVote = this.voteRepository.create({ user, post, voteType })
    await this.voteRepository.save(newVote);
    return 'Vote thành công';
  }

  async getVoteByUser(userId: number): Promise<ResponseVoteDto[]> {
    const votes = await this.voteRepository.find({
      where: { user: { id: userId } },
      select: {
        post: { id: true },
        voteType: true
      },
      relations: ['post']
    })

    return votes.map(vote => new ResponseVoteDto(vote));
  }
}
