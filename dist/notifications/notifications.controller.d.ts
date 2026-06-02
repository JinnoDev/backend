import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(user: any): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").NotificationDocument> & import("./schemas/notification.schema").Notification & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        unreadCount: number;
    }>;
    markAllAsRead(user: any): Promise<{
        success: boolean;
    }>;
}
