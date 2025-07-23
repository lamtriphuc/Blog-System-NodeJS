import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';
import { VoteEntity } from './vote.entity';
import { SavedPostEntity } from './saved-post.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column('text')
    password_hash: string;

    @Column({ length: 255, nullable: true })
    bio: string;

    @Column('text', { nullable: true })
    avatar_url: string;

    @Column({ type: 'int', default: 0 })
    role: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => PostEntity, post => post.user)
    posts: PostEntity[];

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[];

    @OneToMany(() => VoteEntity, vote => vote.user)
    votes: VoteEntity[];

    @OneToMany(() => SavedPostEntity, saved => saved.user)
    savedPosts: SavedPostEntity[];
}