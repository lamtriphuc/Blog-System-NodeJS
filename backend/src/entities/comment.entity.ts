import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity('comments')
export class CommentEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.comments, { onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, post => post.comments, { onDelete: 'CASCADE' })
    post: PostEntity;

    @Column('text')
    content: string;

    @CreateDateColumn()
    created_at: Date;
}
