export declare class CreateChatDto {
    participants: string[];
}
export declare class SendMessageDto {
    content: string;
    type: 'text' | 'image' | 'video' | 'audio';
}
export interface IChat {
    id: string;
    participants: string[];
    lastMessage?: string;
    lastMessageAt?: Date;
    createdAt: Date;
}
export interface IMessage {
    id: string;
    chatId: string;
    senderId: string;
    type: 'text' | 'image' | 'video' | 'audio';
    content: string;
    readBy: string[];
    createdAt: Date;
}
