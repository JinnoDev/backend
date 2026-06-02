import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { PostDocument } from '../posts/schemas/post.schema';
export declare class SearchService {
    private userModel;
    private postModel;
    constructor(userModel: Model<UserDocument>, postModel: Model<PostDocument>);
    search(query: string, page: number, limit: number): Promise<{
        query: string;
        data: ({
            email: string;
            username: string;
            password: string;
            name: string;
            bio: string;
            avatar: string;
            followersCount: number;
            followingCount: number;
            _id: any;
            __v?: any;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
            type: string;
        } | {
            authorId: import("mongoose").Types.ObjectId;
            caption: string;
            mediaUrl: string;
            likesCount: number;
            commentsCount: number;
            repostsCount: number;
            _id: any;
            __v?: any;
            $locals: Record<string, unknown>;
            $op: "save" | "validate" | "remove" | null;
            $where: Record<string, unknown>;
            baseModelName?: string;
            collection: import("mongoose").Collection;
            db: import("mongoose").Connection;
            errors?: import("mongoose").Error.ValidationError;
            id?: any;
            isNew: boolean;
            schema: import("mongoose").Schema;
            type: string;
        })[];
        page: number;
        limit: number;
        total: number;
    }>;
}
