import { Document, Types } from 'mongoose';
export type ChatDocument = Chat & Document;
export declare class Chat {
    participants: Types.ObjectId[];
    lastMessage: string;
    lastMessageAt: Date;
}
export declare const ChatSchema: import("mongoose").Schema<Chat, import("mongoose").Model<Chat, any, any, any, Document<unknown, any, Chat> & Chat & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Chat, Document<unknown, {}, import("mongoose").FlatRecord<Chat>> & import("mongoose").FlatRecord<Chat> & {
    _id: Types.ObjectId;
}>;
export type MessageDocument = Message & Document;
export declare class Message {
    chatId: Types.ObjectId;
    senderId: Types.ObjectId;
    type: string;
    content: string;
    readBy: Types.ObjectId[];
}
export declare const MessageSchema: import("mongoose").Schema<Message, import("mongoose").Model<Message, any, any, any, Document<unknown, any, Message> & Message & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Message, Document<unknown, {}, import("mongoose").FlatRecord<Message>> & import("mongoose").FlatRecord<Message> & {
    _id: Types.ObjectId;
}>;
