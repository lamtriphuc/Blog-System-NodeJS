import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { PostEntity } from './post.entity';
import { CommentEntity } from './comment.entity';
import { VoteEntity } from './vote.entity';
import { SavedPostEntity } from './saved-post.entity';
import { ReportEntity } from './report.entity';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    username: string;

    @Column({ length: 100, unique: true })
    email: string;

    @Column('text', { name: 'passworn_hash' })
    passwordHash: string;

    @Column({ length: 255, nullable: true })
    bio: string;

    @Column('text', { nullable: true, name: 'avatar_url' })
    avatarUrl: string;

    @Column({ type: 'int', default: 0 })
    role: number;

    @Column({ name: 'refresh_token', nullable: true })
    refreshToken: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => PostEntity, post => post.user)
    posts: PostEntity[];

    @OneToMany(() => CommentEntity, comment => comment.user)
    comments: CommentEntity[];

    @OneToMany(() => VoteEntity, vote => vote.user)
    votes: VoteEntity[];

    @OneToMany(() => SavedPostEntity, saved => saved.user)
    savedPosts: SavedPostEntity[];

    @OneToMany(() => ReportEntity, report => report.user)
    reports: ReportEntity[];

    @Column({ name: 'is_banned', default: false })
    isBanned: boolean;

    @Column({ name: 'banned_until', type: 'timestamp', nullable: true })
    bannedUntil: Date | null;
}