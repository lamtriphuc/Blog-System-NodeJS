import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notificationRepo: Repository<NotificationEntity>,
    ) { }

    async createNotification(userId: number, type: string, entityId: number, message: string) {
        const notif = this.notificationRepo.create({
            user: { id: userId } as any,
            type,
            entityId,
            message,
        });
        return await this.notificationRepo.save(notif);
    }

    async getUserNotifications(userId: number) {
        return await this.notificationRepo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
            take: 20, // lấy 20 
        });
    }

    async markAsRead(id: number) {
        await this.notificationRepo.update(id, { isRead: true });
        return { success: true };
    }

    async markAllAsRead(userId: number) {
        await this.notificationRepo.update({ user: { id: userId } }, { isRead: true });
        return { success: true };
    }

    async getUnreadNotifications(userId: number) {
        return await this.notificationRepo.find({
            where: { user: { id: userId }, isRead: false },
            order: { createdAt: 'DESC' },
        });
    }
}
