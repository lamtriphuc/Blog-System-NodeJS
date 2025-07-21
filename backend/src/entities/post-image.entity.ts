import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('post_images')
export class PostImage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Post, post => post.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'post_id' })
    post: Post;

    @Column('text', { name: 'image_url' })
    imageUrl: string;
}
