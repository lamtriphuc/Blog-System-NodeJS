import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Vote } from './vote.entity';
import { SavedPost } from './saved-post.entity';
import { PostImage } from './post-image.entity';
import { PostTag } from './post-tag.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('text')
    title: string;

    @Column('text')
    content: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => PostImage, img => img.post)
    images: PostImage[];

    @OneToMany(() => Comment, comment => comment.post)
    comments: Comment[];

    @OneToMany(() => Vote, vote => vote.post)
    votes: Vote[];

    @OneToMany(() => PostTag, postTag => postTag.post)
    postTags: PostTag[];

    @OneToMany(() => SavedPost, saved => saved.post)
    savedPosts: SavedPost[];
}
