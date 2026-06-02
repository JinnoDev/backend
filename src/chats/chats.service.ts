import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument, Message, MessageDocument } from './schemas/chat.schema';
import { CreateChatDto, SendMessageDto } from './dto/chats.dto';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async getChats(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.chatModel.find({ participants: userId }).sort({ lastMessageAt: -1 }).skip(skip).limit(limit),
      this.chatModel.countDocuments({ participants: userId }),
    ]);
    return { data, page, limit, total };
  }

  async createChat(creatorId: string, dto: CreateChatDto) {
    const participants = [...new Set([creatorId, ...dto.participants])];
    if (participants.length === 2) {
      const existing = await this.chatModel.findOne({
        participants: { $all: participants, $size: 2 },
      });
      if (existing) return existing;
    }
    return this.chatModel.create({ participants });
  }

  async getMessages(userId: string, chatId: string, page: number, limit: number) {
    const chat = await this.findChatOrThrow(chatId);
    if (!chat.participants.map(String).includes(userId))
      throw new ForbiddenException('No eres parte de este chat');

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.messageModel.find({ chatId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      this.messageModel.countDocuments({ chatId }),
    ]);
    return { data, page, limit, total };
  }

  async sendMessage(userId: string, chatId: string, dto: SendMessageDto) {
    const chat = await this.findChatOrThrow(chatId);
    if (!chat.participants.map(String).includes(userId))
      throw new ForbiddenException('No eres parte de este chat');

    const message = await this.messageModel.create({
      chatId, senderId: userId, type: dto.type, content: dto.content, readBy: [userId],
    });

    await this.chatModel.findByIdAndUpdate(chatId, {
      lastMessage: dto.content,
      lastMessageAt: new Date(),
    });

    return message;
  }

  async markAsRead(userId: string, chatId: string) {
    const chat = await this.findChatOrThrow(chatId);
    if (!chat.participants.map(String).includes(userId))
      throw new ForbiddenException('No eres parte de este chat');

    await this.messageModel.updateMany(
      { chatId, readBy: { $ne: userId } },
      { $push: { readBy: userId } },
    );
    return { success: true };
  }

  private async findChatOrThrow(chatId: string): Promise<ChatDocument> {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat no encontrado');
    return chat;
  }
}
