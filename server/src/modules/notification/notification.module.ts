import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationEntity } from "src/entities/notification.entity";
import { NotificationController } from "./notification.controller";
import { NotificationsService } from "./notification.service";
import { NotificationsGateway } from "./notifications.gateway";

@Module({
    imports: [TypeOrmModule.forFeature([NotificationEntity])],
    controllers: [NotificationController],
    providers: [NotificationsService, NotificationsGateway],
    exports: [NotificationsService, NotificationsGateway]
})

export class NotificationModule { }