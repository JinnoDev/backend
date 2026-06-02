import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/comments.dto';
import { PostsService } from '../posts/posts.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class CommentsService {
    private commentModel;
    private readonly postsService;
    private readonly notificationsService;
    constructor(commentModel: Model<CommentDocument>, postsService: PostsService, notificationsService: NotificationsService);
    getComments(postId: string, page: number, limit: number): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    createComment(userId: string, postId: string, dto: CreateCommentDto): Promise<import("mongoose").Document<unknown, {}, CommentDocument> & Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteComment(userId: string, commentId: string): Promise<{
        success: boolean;
    }>;
}
