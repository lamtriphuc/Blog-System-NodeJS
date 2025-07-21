import { VoteType } from "src/global/globalEnum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity('votes')
@Unique(['user', 'post'])
export class Vote {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'smallint', name: 'vote_type' })
    voteType: VoteType; // 1: upvote, -1: downvote

    @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Post, post => post.id, { onDelete: 'CASCADE' })
    post: Post
}