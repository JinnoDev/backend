import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
export declare class NotificationsService {
    private notifModel;
    constructor(notifModel: Model<NotificationDocument>);
    getNotifications(userId: string): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, NotificationDocument> & Notification & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        unreadCount: number;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
    create(data: {
        userId: string;
        actorId: string;
        type: string;
        postId?: string;
        message: string;
    }): Promise<void>;
    remove(data: {
        userId: string;
        actorId: string;
        type: string;
        postId?: string;
    }): Promise<void>;
}
