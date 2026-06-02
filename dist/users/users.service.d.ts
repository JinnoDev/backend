import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FollowDocument } from './schemas/follow.schema';
import { UpdateProfileDto } from './dto/users.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class UsersService {
    private userModel;
    private followModel;
    private readonly notificationsService;
    constructor(userModel: Model<UserDocument>, followModel: Model<FollowDocument>, notificationsService: NotificationsService);
    getMe(userId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateMe(userId: string, dto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getPublicProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    follow(followerId: string, targetId: string): Promise<{
        success: boolean;
    }>;
    unfollow(followerId: string, targetId: string): Promise<{
        success: boolean;
    }>;
    getFollowers(userId: string, page: number, limit: number): Promise<{
        data: import("mongoose").Types.ObjectId[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    getFollowing(userId: string, page: number, limit: number): Promise<{
        data: import("mongoose").Types.ObjectId[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    findById(userId: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
}
