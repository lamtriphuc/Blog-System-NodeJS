import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
    UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable,
    JoinColumn
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CommentEntity } from './comment.entity';
import { VoteEntity } from './vote.entity';
import { PostImageEntity } from './post-image.entity';
import { TagEntity } from './tag.entity';
import { SavedPostEntity } from './saved-post.entity';
import { ReportEntity } from './report.entity';

@Entity('posts')
export class PostEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.posts, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: UserEntity;

    @Column('text')
    title: string;

    @Column('text')
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => PostImageEntity, image => image.post)
    images: PostImageEntity[];

    @OneToMany(() => CommentEntity, comment => comment.post)
    comments: CommentEntity[];

    @OneToMany(() => VoteEntity, vote => vote.post)
    votes: VoteEntity[];

    @ManyToMany(() => TagEntity, tag => tag.posts)
    @JoinTable({
        name: 'post_tags',
        joinColumn: { name: 'post_id' },
        inverseJoinColumn: { name: 'tag_id' },
    })
    tags: TagEntity[];

    @OneToMany(() => SavedPostEntity, saved => saved.post)
    savedBy: SavedPostEntity[];

    @OneToMany(() => ReportEntity, report => report.post)
    reports: ReportEntity[];
}
