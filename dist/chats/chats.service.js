"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const chat_schema_1 = require("./schemas/chat.schema");
let ChatsService = class ChatsService {
    constructor(chatModel, messageModel) {
        this.chatModel = chatModel;
        this.messageModel = messageModel;
    }
    async getChats(userId, page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.chatModel.find({ participants: userId }).sort({ lastMessageAt: -1 }).skip(skip).limit(limit),
            this.chatModel.countDocuments({ participants: userId }),
        ]);
        return { data, page, limit, total };
    }
    async createChat(creatorId, dto) {
        const participants = [...new Set([creatorId, ...dto.participants])];
        if (participants.length === 2) {
            const existing = await this.chatModel.findOne({
                participants: { $all: participants, $size: 2 },
            });
            if (existing)
                return existing;
        }
        return this.chatModel.create({ participants });
    }
    async getMessages(userId, chatId, page, limit) {
        const chat = await this.findChatOrThrow(chatId);
        if (!chat.participants.map(String).includes(userId))
            throw new common_1.ForbiddenException('No eres parte de este chat');
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.messageModel.find({ chatId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
            this.messageModel.countDocuments({ chatId }),
        ]);
        return { data, page, limit, total };
    }
    async sendMessage(userId, chatId, dto) {
        const chat = await this.findChatOrThrow(chatId);
        if (!chat.participants.map(String).includes(userId))
            throw new common_1.ForbiddenException('No eres parte de este chat');
        const message = await this.messageModel.create({
            chatId, senderId: userId, type: dto.type, content: dto.content, readBy: [userId],
        });
        await this.chatModel.findByIdAndUpdate(chatId, {
            lastMessage: dto.content,
            lastMessageAt: new Date(),
        });
        return message;
    }
    async markAsRead(userId, chatId) {
        const chat = await this.findChatOrThrow(chatId);
        if (!chat.participants.map(String).includes(userId))
            throw new common_1.ForbiddenException('No eres parte de este chat');
        await this.messageModel.updateMany({ chatId, readBy: { $ne: userId } }, { $push: { readBy: userId } });
        return { success: true };
    }
    async findChatOrThrow(chatId) {
        const chat = await this.chatModel.findById(chatId);
        if (!chat)
            throw new common_1.NotFoundException('Chat no encontrado');
        return chat;
    }
};
exports.ChatsService = ChatsService;
exports.ChatsService = ChatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(chat_schema_1.Chat.name)),
    __param(1, (0, mongoose_1.InjectModel)(chat_schema_1.Message.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatsService);
//# sourceMappingURL=chats.service.js.map