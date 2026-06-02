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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const comment_schema_1 = require("./schemas/comment.schema");
const posts_service_1 = require("../posts/posts.service");
const notifications_service_1 = require("../notifications/notifications.service");
let CommentsService = class CommentsService {
    constructor(commentModel, postsService, notificationsService) {
        this.commentModel = commentModel;
        this.postsService = postsService;
        this.notificationsService = notificationsService;
    }
    async getComments(postId, page, limit) {
        await this.postsService.findOrThrow(postId);
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.commentModel.find({ postId }).populate('authorId', 'username avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
            this.commentModel.countDocuments({ postId }),
        ]);
        return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async createComment(userId, postId, dto) {
        const post = await this.postsService.findOrThrow(postId);
        const created = await this.commentModel.create({ postId, authorId: userId, text: dto.text });
        await this.postsService.incrementCommentCount(postId, 1);
        const comment = await this.commentModel.findById(created._id).populate('authorId', 'username avatar');
        const ownerId = post.authorId.toString();
        if (ownerId !== userId) {
            await this.notificationsService.create({
                userId: ownerId,
                actorId: userId,
                type: 'comment',
                postId,
                message: `comentó en tu publicación: "${dto.text.slice(0, 50)}"`,
            });
        }
        return comment || created;
    }
    async deleteComment(userId, commentId) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment)
            throw new common_1.NotFoundException('Comentario no encontrado');
        if (comment.authorId.toString() !== userId)
            throw new common_1.ForbiddenException('No puedes eliminar este comentario');
        await this.commentModel.findByIdAndDelete(commentId);
        await this.postsService.incrementCommentCount(comment.postId.toString(), -1);
        return { success: true };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(comment_schema_1.Comment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        posts_service_1.PostsService,
        notifications_service_1.NotificationsService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map