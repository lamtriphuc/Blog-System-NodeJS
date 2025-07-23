import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';
import { VoteType } from 'src/global/globalEnum';

@Entity('votes')
@Unique(['user', 'post'])
export class VoteEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.votes, { onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, post => post.votes, { onDelete: 'CASCADE' })
    post: PostEntity;

    @Column({ type: 'smallint', name: 'vote_type' })
    voteType: VoteType;
}
