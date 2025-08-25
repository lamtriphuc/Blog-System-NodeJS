import { Controller, Get, HttpStatus, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { NotificationsService } from "./notification.service";
import { ResponseData } from "src/global/globalClass";

@Controller('api/notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
    constructor(private readonly notificationsService: NotificationsService) { }

    // Lấy tất cả thông báo của user hiện tại
    @Get()
    async getMyNotifications(@Req() req) {
        const notifs = await this.notificationsService.getUserNotifications(req.user.id);
        return new ResponseData(notifs, HttpStatus.OK, 'Lấy thông báo thành công')
    }

    @Get('unread')
    async getUnread(@Req() req) {
        const notifs = await this.notificationsService.getUnreadNotifications(req.user.id);
        return new ResponseData(notifs, HttpStatus.OK, 'Lấy thông báo chưa đọc');
    }

    @Patch('read-all')
    async markAllRead(@Req() req) {
        return this.notificationsService.markAllAsRead(req.user.id);
    }

    // Đánh dấu 1 thông báo là đã đọc
    @Patch(':id/read')
    async markRead(@Param('id') id: number) {
        return this.notificationsService.markAsRead(id);
    }
}