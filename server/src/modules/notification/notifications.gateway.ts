import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
    @WebSocketServer()
    server: Server;

    sendToUser(userId: number, notification: any) {
        this.server.to(`user_${userId}`).emit('notification', notification);
    }

    handleConnection(client: any) {
        // giả sử FE truyền userId khi kết nối
        const userId = client.handshake.query.userId;
        if (userId) {
            client.join(`user_${userId}`);
        }
    }
}
