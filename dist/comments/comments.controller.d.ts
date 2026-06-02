import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/comments.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    getComments(postId: string, page: number, limit: number): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, import("./schemas/comment.schema").CommentDocument> & import("./schemas/comment.schema").Comment & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    createComment(user: any, postId: string, dto: CreateCommentDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/comment.schema").CommentDocument> & import("./schemas/comment.schema").Comment & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteComment(user: any, commentId: string): Promise<{
        success: boolean;
    }>;
}
