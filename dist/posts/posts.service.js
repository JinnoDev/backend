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
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const post_schema_1 = require("./schemas/post.schema");
const interactions_schema_1 = require("./schemas/interactions.schema");
const notifications_service_1 = require("../notifications/notifications.service");
const follow_schema_1 = require("../users/schemas/follow.schema");
let PostsService = class PostsService {
    constructor(postModel, likeModel, repostModel, saveModel, followModel, notificationsService) {
        this.postModel = postModel;
        this.likeModel = likeModel;
        this.repostModel = repostModel;
        this.saveModel = saveModel;
        this.followModel = followModel;
        this.notificationsService = notificationsService;
    }
    async getFeed(userId, page, limit) {
        const skip = (page - 1) * limit;
        const following = await this.followModel.find({ followerId: userId }).select('followingId');
        const followingIds = following.map((f) => f.followingId);
        const filter = { authorId: { $in: followingIds } };
        const [data, total] = await Promise.all([
            this.postModel.find(filter).populate('authorId', 'username avatar name').sort({ createdAt: -1 }).skip(skip).limit(limit),
            this.postModel.countDocuments(filter),
        ]);
        return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async getAllPosts(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.postModel.find().populate('authorId', 'username avatar name').sort({ createdAt: -1 }).skip(skip).limit(limit),
            this.postModel.countDocuments(),
        ]);
        return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async getPostsByUser(userId, page, limit) {
        const skip = (page - 1) * limit;
        const ownPosts = await this.postModel
            .find({ authorId: userId })
            .populate('authorId', 'username avatar name')
            .sort({ createdAt: -1 })
            .lean();
        const reposts = await this.repostModel.find({ userId }).select('postId createdAt').lean();
        const repostPostIds = reposts.map((r) => r.postId);
        const repostedPosts = await this.postModel
            .find({ _id: { $in: repostPostIds } })
            .populate('authorId', 'username avatar name')
            .lean();
        const repostedWithMeta = repostedPosts.map((p) => ({
            ...p,
            isRepost: true,
            repostedByUserId: userId,
        }));
        const ownIds = new Set(ownPosts.map((p) => p._id.toString()));
        const uniqueReposts = repostedWithMeta.filter((p) => !ownIds.has(p._id.toString()));
        const all = [...ownPosts, ...uniqueReposts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const total = all.length;
        const data = all.slice(skip, skip + limit);
        return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async createPost(userId, dto, mediaUrl) {
        const post = await this.postModel.create({
            authorId: userId,
            caption: dto.caption,
            mediaUrl: mediaUrl ?? '',
        });
        return this.postModel.findById(post._id).populate('authorId', 'username avatar name');
    }
    async updatePost(userId, postId, dto) {
        const post = await this.findOrThrow(postId);
        if (post.authorId.toString() !== userId)
            throw new common_1.ForbiddenException('No es tu post');
        return this.postModel.findByIdAndUpdate(postId, dto, { new: true });
    }
    async deletePost(userId, postId) {
        const post = await this.findOrThrow(postId);
        if (post.authorId.toString() !== userId)
            throw new common_1.ForbiddenException('No es tu post');
        await this.postModel.findByIdAndDelete(postId);
        return { success: true };
    }
    async likePost(userId, postId) {
        const post = await this.findOrThrow(postId);
        try {
            await this.likeModel.create({ userId, postId });
        }
        catch {
            throw new common_1.ConflictException('Ya diste like');
        }
        const updated = await this.postModel.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } }, { new: true });
        const ownerId = post.authorId.toString();
        if (ownerId !== userId) {
            await this.notificationsService.create({ userId: ownerId, actorId: userId, type: 'like', postId, message: 'le dio like a tu publicación' });
        }
        return { success: true, likesCount: updated?.likesCount };
    }
    async unlikePost(userId, postId) {
        const post = await this.findOrThrow(postId);
        const result = await this.likeModel.findOneAndDelete({ userId, postId });
        if (!result)
            throw new common_1.NotFoundException('No habías dado like');
        const updated = await this.postModel.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } }, { new: true });
        const ownerId = post.authorId.toString();
        if (ownerId !== userId) {
            await this.notificationsService.remove({ userId: ownerId, actorId: userId, type: 'like', postId });
        }
        return { success: true, likesCount: updated?.likesCount };
    }
    async repost(userId, postId) {
        const post = await this.findOrThrow(postId);
        const existing = await this.repostModel.findOne({ userId, postId });
        if (existing) {
            await this.repostModel.deleteOne({ userId, postId });
            const updated = await this.postModel.findByIdAndUpdate(postId, { $inc: { repostsCount: -1 } }, { new: true });
            const ownerId = post.authorId.toString();
            if (ownerId !== userId) {
                await this.notificationsService.remove({ userId: ownerId, actorId: userId, type: 'repost', postId });
            }
            return { success: true, reposted: false, repostsCount: updated?.repostsCount };
        }
        await this.repostModel.create({ userId, postId });
        const updated = await this.postModel.findByIdAndUpdate(postId, { $inc: { repostsCount: 1 } }, { new: true });
        const ownerId = post.authorId.toString();
        if (ownerId !== userId) {
            await this.notificationsService.create({ userId: ownerId, actorId: userId, type: 'repost', postId, message: 'reposteó tu publicación' });
        }
        return { success: true, reposted: true, repostsCount: updated?.repostsCount };
    }
    async savePost(userId, postId) {
        await this.findOrThrow(postId);
        try {
            await this.saveModel.create({ userId, postId });
        }
        catch {
            throw new common_1.ConflictException('Ya guardaste este post');
        }
        return { success: true };
    }
    async unsavePost(userId, postId) {
        await this.findOrThrow(postId);
        const result = await this.saveModel.findOneAndDelete({ userId, postId });
        if (!result)
            throw new common_1.NotFoundException('No habías guardado este post');
        return { success: true };
    }
    async getSavedPosts(userId, page, limit) {
        const skip = (page - 1) * limit;
        const saves = await this.saveModel.find({ userId }).skip(skip).limit(limit);
        const postIds = saves.map((s) => s.postId);
        const data = await this.postModel.find({ _id: { $in: postIds } }).populate('authorId', 'username avatar');
        const total = await this.saveModel.countDocuments({ userId });
        return { data, page, limit, total, totalPages: Math.ceil(total / limit) };
    }
    async incrementCommentCount(postId, delta) {
        await this.postModel.findByIdAndUpdate(postId, { $inc: { commentsCount: delta } });
    }
    async findOrThrow(postId) {
        const post = await this.postModel.findById(postId);
        if (!post)
            throw new common_1.NotFoundException('Post no encontrado');
        return post;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(post_schema_1.Post.name)),
    __param(1, (0, mongoose_1.InjectModel)(interactions_schema_1.Like.name)),
    __param(2, (0, mongoose_1.InjectModel)(interactions_schema_1.Repost.name)),
    __param(3, (0, mongoose_1.InjectModel)(interactions_schema_1.Save.name)),
    __param(4, (0, mongoose_1.InjectModel)(follow_schema_1.Follow.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], PostsService);
//# sourceMappingURL=posts.service.js.map