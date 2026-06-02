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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const follow_schema_1 = require("./schemas/follow.schema");
const notifications_service_1 = require("../notifications/notifications.service");
let UsersService = class UsersService {
    constructor(userModel, followModel, notificationsService) {
        this.userModel = userModel;
        this.followModel = followModel;
        this.notificationsService = notificationsService;
    }
    async getMe(userId) {
        const user = await this.userModel.findById(userId).select('-password');
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const blockedDomains = ['pravatar.cc', 'picsum.photos', 'placeholder.com', 'via.placeholder', 'unsplash.com'];
        if (user.avatar && blockedDomains.some(d => user.avatar.includes(d))) {
            await this.userModel.findByIdAndUpdate(userId, { avatar: '' });
            user.avatar = '';
        }
        return user;
    }
    async updateMe(userId, dto) {
        const user = await this.userModel
            .findByIdAndUpdate(userId, dto, { new: true })
            .select('-password');
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return user;
    }
    async getPublicProfile(userId) {
        const user = await this.userModel.findById(userId).select('-password -email');
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        const blockedDomains = ['pravatar.cc', 'picsum.photos', 'placeholder.com', 'via.placeholder'];
        if (user.avatar && blockedDomains.some(d => user.avatar.includes(d))) {
            await this.userModel.findByIdAndUpdate(userId, { avatar: '' });
            user.avatar = '';
        }
        return user;
    }
    async follow(followerId, targetId) {
        if (followerId === targetId)
            throw new common_1.ConflictException('No puedes seguirte a ti mismo');
        const target = await this.userModel.findById(targetId);
        if (!target)
            throw new common_1.NotFoundException('Usuario no encontrado');
        try {
            await this.followModel.create({ followerId, followingId: targetId });
        }
        catch {
            throw new common_1.ConflictException('Ya sigues a este usuario');
        }
        await this.userModel.findByIdAndUpdate(targetId, { $inc: { followersCount: 1 } });
        await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
        await this.notificationsService.create({
            userId: targetId,
            actorId: followerId,
            type: 'follow',
            message: 'comenzó a seguirte',
        });
        return { success: true };
    }
    async unfollow(followerId, targetId) {
        const result = await this.followModel.findOneAndDelete({
            followerId,
            followingId: targetId,
        });
        if (!result)
            throw new common_1.NotFoundException('No sigues a este usuario');
        await this.userModel.findByIdAndUpdate(targetId, { $inc: { followersCount: -1 } });
        await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
        await this.notificationsService.remove({ userId: targetId, actorId: followerId, type: 'follow' });
        return { success: true };
    }
    async getFollowers(userId, page, limit) {
        const skip = (page - 1) * limit;
        const follows = await this.followModel
            .find({ followingId: userId })
            .populate('followerId', '-password -email')
            .skip(skip)
            .limit(limit);
        const total = await this.followModel.countDocuments({ followingId: userId });
        return {
            data: follows.map((f) => f.followerId),
            page, limit, total,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getFollowing(userId, page, limit) {
        const skip = (page - 1) * limit;
        const follows = await this.followModel
            .find({ followerId: userId })
            .populate('followingId', '-password -email')
            .skip(skip)
            .limit(limit);
        const total = await this.followModel.countDocuments({ followerId: userId });
        return {
            data: follows.map((f) => f.followingId),
            page, limit, total,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(userId) {
        return this.userModel.findById(userId).select('-password');
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(follow_schema_1.Follow.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        notifications_service_1.NotificationsService])
], UsersService);
//# sourceMappingURL=users.service.js.map