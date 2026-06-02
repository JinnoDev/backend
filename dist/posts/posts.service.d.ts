import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { LikeDocument, RepostDocument, SaveDocument } from './schemas/interactions.schema';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PostsService {
    private postModel;
    private likeModel;
    private repostModel;
    private saveModel;
    private followModel;
    private readonly notificationsService;
    constructor(postModel: Model<PostDocument>, likeModel: Model<LikeDocument>, repostModel: Model<RepostDocument>, saveModel: Model<SaveDocument>, followModel: Model<any>, notificationsService: NotificationsService);
    getFeed(userId: string, page: number, limit: number): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, PostDocument> & Post & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        }, never>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    getAllPosts(page: number, limit: number): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, PostDocument> & Post & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        }, never>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    getPostsByUser(userId: string, page: number, limit: number): Promise<{
        data: any[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    createPost(userId: string, dto: CreatePostDto, mediaUrl?: string): Promise<(import("mongoose").Document<unknown, {}, PostDocument> & Post & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }) | null>;
    updatePost(userId: string, postId: string, dto: UpdatePostDto): Promise<(import("mongoose").Document<unknown, {}, PostDocument> & Post & import("mongoose").Document<any, any, any> & {
        _id: Types.ObjectId;
    }) | null>;
    deletePost(userId: string, postId: string): Promise<{
        success: boolean;
    }>;
    likePost(userId: string, postId: string): Promise<{
        success: boolean;
        likesCount: number | undefined;
    }>;
    unlikePost(userId: string, postId: string): Promise<{
        success: boolean;
        likesCount: number | undefined;
    }>;
    repost(userId: string, postId: string): Promise<{
        success: boolean;
        reposted: boolean;
        repostsCount: number | undefined;
    }>;
    savePost(userId: string, postId: string): Promise<{
        success: boolean;
    }>;
    unsavePost(userId: string, postId: string): Promise<{
        success: boolean;
    }>;
    getSavedPosts(userId: string, page: number, limit: number): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, PostDocument> & Post & import("mongoose").Document<any, any, any> & {
            _id: Types.ObjectId;
        }, never>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    incrementCommentCount(postId: string, delta: 1 | -1): Promise<void>;
    findOrThrow(postId: string): Promise<PostDocument>;
}
