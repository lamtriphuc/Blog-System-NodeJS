import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { PostEntity } from './post.entity';

@Entity('tags')
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30, unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToMany(() => PostEntity, post => post.tags)
    posts: PostEntity[];
}
