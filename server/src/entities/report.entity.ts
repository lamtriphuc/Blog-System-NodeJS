// entities/report.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { PostEntity } from './post.entity';

@Entity('reports')
export class ReportEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.reports, { onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToOne(() => PostEntity, (post) => post.reports, { onDelete: 'CASCADE' })
    post: PostEntity;

    @Column({ type: 'text' })
    reason: string;

    @CreateDateColumn()
    createdAt: Date;
}
