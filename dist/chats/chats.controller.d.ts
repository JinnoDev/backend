import { ChatsService } from './chats.service';
import { CreateChatDto, SendMessageDto } from './dto/chats.dto';
export declare class ChatsController {
    private readonly chatsService;
    constructor(chatsService: ChatsService);
    getChats(user: any, page: number, limit: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/chat.schema").ChatDocument> & import("./schemas/chat.schema").Chat & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    createChat(user: any, dto: CreateChatDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/chat.schema").ChatDocument> & import("./schemas/chat.schema").Chat & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getMessages(user: any, chatId: string, page: number, limit: number): Promise<{
        data: (import("mongoose").Document<unknown, {}, import("./schemas/chat.schema").MessageDocument> & import("./schemas/chat.schema").Message & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
    sendMessage(user: any, chatId: string, dto: SendMessageDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/chat.schema").MessageDocument> & import("./schemas/chat.schema").Message & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    markAsRead(user: any, chatId: string): Promise<{
        success: boolean;
    }>;
}
