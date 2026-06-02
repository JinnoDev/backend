import { Model } from 'mongoose';
import { Chat, ChatDocument, Message, MessageDocument } from './schemas/chat.schema';
import { CreateChatDto, SendMessageDto } from './dto/chats.dto';
export declare class ChatsService {
    private chatModel;
    private messageModel;
    constructor(chatModel: Model<ChatDocument>, messageModel: Model<MessageDocument>);
    getChats(userId: string, page: number, limit: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, ChatDocument> & Chat & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    createChat(creatorId: string, dto: CreateChatDto): Promise<import("mongoose").Document<unknown, {}, ChatDocument> & Chat & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMessages(userId: string, chatId: string, page: number, limit: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, MessageDocument> & Message & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    sendMessage(userId: string, chatId: string, dto: SendMessageDto): Promise<import("mongoose").Document<unknown, {}, MessageDocument> & Message & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    markAsRead(userId: string, chatId: string): Promise<{
        success: boolean;
    }>;
    private findChatOrThrow;
}
