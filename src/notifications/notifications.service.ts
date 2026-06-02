import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notifModel: Model<NotificationDocument>,
  ) {}

  async getNotifications(userId: string) {
    const data = await this.notifModel
      .find({ userId })
      .populate('actorId', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await this.notifModel.countDocuments({ userId, read: false });
    return { data, unreadCount };
  }

  async markAllAsRead(userId: string) {
    await this.notifModel.updateMany({ userId, read: false }, { read: true });
    return { success: true };
  }

  // Create or update — never duplicates (upsert by userId+actorId+type+postId)
  async create(data: { userId: string; actorId: string; type: string; postId?: string; message: string }) {
    const filter: any = { userId: data.userId, actorId: data.actorId, type: data.type };
    if (data.postId) filter.postId = data.postId;

    // Upsert: update existing or create new, reset read to false
    await this.notifModel.findOneAndUpdate(
      filter,
      { ...data, read: false, createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  }

  // Remove notification when action is undone (unlike, unfollow, unrepost)
  async remove(data: { userId: string; actorId: string; type: string; postId?: string }) {
    const filter: any = { userId: data.userId, actorId: data.actorId, type: data.type };
    if (data.postId) filter.postId = data.postId;
    await this.notifModel.deleteOne(filter);
  }
}
