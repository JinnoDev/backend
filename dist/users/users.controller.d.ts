import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument> & import("./schemas/user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateMe(user: any, dto: UpdateProfileDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument> & import("./schemas/user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    updateAvatar(user: any, file: Express.Multer.File): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument> & import("./schemas/user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getProfile(userId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/user.schema").UserDocument> & import("./schemas/user.schema").User & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    follow(user: any, targetId: string): Promise<{
        success: boolean;
    }>;
    unfollow(user: any, targetId: string): Promise<{
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
}
