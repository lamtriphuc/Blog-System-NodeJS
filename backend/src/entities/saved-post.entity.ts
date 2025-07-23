import { Entity, ManyToOne, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity('saved_posts')
export class SavedPostEntity {
    @PrimaryColumn()
    user_id: number;

    @PrimaryColumn()
    post_id: number;

    @ManyToOne(() => UserEntity, user => user.savedPosts, { onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, post => post.savedBy, { onDelete: 'CASCADE' })
    post: PostEntity;

    @CreateDateColumn()
    created_at: Date;
}
