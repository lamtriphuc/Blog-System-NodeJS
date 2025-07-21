import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Post } from './post.entity';
import { Comment } from './comment.entity';
import { Vote } from './vote.entity';
import { SavedPost } from './saved-post.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({ length: 255, nullable: true })
    bio: string;

    @Column('text', { name: 'avatar_url', nullable: true })
    avatar: string;

    @Column({ type: 'int', default: 0 })
    role: number;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Post, post => post.user)
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];

    @OneToMany(() => Vote, vote => vote.user)
    votes: Vote[];

    @OneToMany(() => SavedPost, saved => saved.user)
    savedPosts: SavedPost[];
}