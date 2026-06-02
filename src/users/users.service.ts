import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Follow, FollowDocument } from './schemas/follow.schema';
import { UpdateProfileDto } from './dto/users.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    // Clean up any external placeholder avatar URLs stored in DB
    const blockedDomains = ['pravatar.cc', 'picsum.photos', 'placeholder.com', 'via.placeholder', 'unsplash.com'];
    if (user.avatar && blockedDomains.some(d => user.avatar.includes(d))) {
      await this.userModel.findByIdAndUpdate(userId, { avatar: '' });
      user.avatar = '';
    }
    return user;
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel
      .findByIdAndUpdate(userId, dto, { new: true })
      .select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async getPublicProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password -email');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    const blockedDomains = ['pravatar.cc', 'picsum.photos', 'placeholder.com', 'via.placeholder'];
    if (user.avatar && blockedDomains.some(d => user.avatar.includes(d))) {
      await this.userModel.findByIdAndUpdate(userId, { avatar: '' });
      user.avatar = '';
    }
    return user;
  }

  async follow(followerId: string, targetId: string) {
    if (followerId === targetId)
      throw new ConflictException('No puedes seguirte a ti mismo');

    const target = await this.userModel.findById(targetId);
    if (!target) throw new NotFoundException('Usuario no encontrado');

    try {
      await this.followModel.create({ followerId, followingId: targetId });
    } catch {
      throw new ConflictException('Ya sigues a este usuario');
    }

    await this.userModel.findByIdAndUpdate(targetId,   { $inc: { followersCount: 1 } });
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });

    // Notify followed user
    await this.notificationsService.create({
      userId: targetId,
      actorId: followerId,
      type: 'follow',
      message: 'comenzó a seguirte',
    });

    return { success: true };
  }

  async unfollow(followerId: string, targetId: string) {
    const result = await this.followModel.findOneAndDelete({
      followerId,
      followingId: targetId,
    });
    if (!result) throw new NotFoundException('No sigues a este usuario');

    await this.userModel.findByIdAndUpdate(targetId,   { $inc: { followersCount: -1 } });
    await this.userModel.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });

    // Remove follow notification when unfollowing
    await this.notificationsService.remove({ userId: targetId, actorId: followerId, type: 'follow' });

    return { success: true };
  }

  async getFollowers(userId: string, page: number, limit: number) {
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

  async getFollowing(userId: string, page: number, limit: number) {
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

  async findById(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }
}
