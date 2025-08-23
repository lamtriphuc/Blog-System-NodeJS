import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('notifications')
export class NotificationEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, user => user.notifications, { onDelete: 'CASCADE' })
    user: UserEntity; // người nhận

    @Column()
    type: string; // "comment", "vote"

    @Column()
    entityId: number;

    @Column()
    message: string; // nội dung hiển thị

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}
