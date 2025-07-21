import { Entity, ManyToOne, CreateDateColumn, PrimaryColumn, Column, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Post } from './post.entity';

@Entity('saved_posts')
export class SavedPost {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    postId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => User, user => user.savedPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Post, post => post.savedPosts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;
}
