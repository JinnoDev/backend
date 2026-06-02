import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatsService } from './chats.service';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/chats',
})
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Map userId -> socketId for targeted delivery
    private userSockets = new Map<string, string>();

    constructor(
        private readonly chatsService: ChatsService,
        private readonly jwtService: JwtService,
    ) {}

    async handleConnection(client: Socket) {
        try {
            const token =
                (client.handshake.auth?.token as string) ||
                (client.handshake.headers?.authorization as string)?.replace('Bearer ', '');

            if (!token) { client.disconnect(); return; }

            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });

            client.data.userId = payload.sub ?? payload.userId;
            this.userSockets.set(client.data.userId, client.id);
            client.join(`user:${client.data.userId}`);
        } catch {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        if (client.data.userId) {
            this.userSockets.delete(client.data.userId);
        }
    }

    // Client joins a specific chat room
    @SubscribeMessage('joinChat')
    handleJoinChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() chatId: string,
    ) {
        client.join(`chat:${chatId}`);
    }

    // Client leaves a chat room
    @SubscribeMessage('leaveChat')
    handleLeaveChat(
        @ConnectedSocket() client: Socket,
        @MessageBody() chatId: string,
    ) {
        client.leave(`chat:${chatId}`);
    }

    // Client sends a message via socket
    @SubscribeMessage('sendMessage')
    async handleSendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { chatId: string; content: string },
    ) {
        const userId = client.data.userId;
        if (!userId) return;

        try {
            const message = await this.chatsService.sendMessage(userId, payload.chatId, {
                content: payload.content,
                type: 'text',
            });

            // Broadcast to everyone in the chat room (including sender)
            this.server.to(`chat:${payload.chatId}`).emit('newMessage', message);

            // Also notify participants not in the room (for chat list update)
            const chat = await this.chatsService.getChatById(payload.chatId);
            if (chat) {
                for (const participantId of chat.participants.map(String)) {
                    if (participantId !== userId) {
                        this.server.to(`user:${participantId}`).emit('chatUpdated', {
                            chatId: payload.chatId,
                            lastMessage: payload.content,
                            lastMessageAt: new Date(),
                        });
                    }
                }
            }
        } catch (err) {
            client.emit('error', { message: 'Error al enviar mensaje' });
        }
    }
}