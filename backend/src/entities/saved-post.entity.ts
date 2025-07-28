import { Entity, ManyToOne, PrimaryColumn, CreateDateColumn, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity('saved_posts')
export class SavedPostEntity {
    @PrimaryColumn({ name: 'user_id' })
    userId: number;

    @PrimaryColumn({ name: 'post_id' })
    postId: number;

    @ManyToOne(() => UserEntity, user => user.savedPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, post => post.savedBy, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: PostEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
