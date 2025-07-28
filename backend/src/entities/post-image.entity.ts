import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('post_images')
export class PostImageEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PostEntity, post => post.images, { onDelete: 'CASCADE' })
    post: PostEntity;

    @Column('text', { name: 'image_url' })
    imageUrl: string;
}
