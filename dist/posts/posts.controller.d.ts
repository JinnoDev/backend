import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto } from './dto/posts.dto';
import { GridFsService } from '../common/gridfs/gridfs.service';
export declare class PostsController {
    private readonly postsService;
    private readonly gridFsService;
    constructor(postsService: PostsService, gridFsService: GridFsService);
    getFeed(user: any, page: number, limit: number): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, import("./schemas/post.schema").PostDocument> & import("./schemas/post.schema").Post & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    getExplorePosts(page: number, limit: number): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, import("./schemas/post.schema").PostDocument> & import("./schemas/post.schema").Post & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
    getMyPosts(user: any, page: number, limit: number): Promise<{
        data: any[];
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
    createPost(user: any, dto: CreatePostDto, file?: Express.Multer.File): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/post.schema").PostDocument> & import("./schemas/post.schema").Post & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    updatePost(user: any, postId: string, dto: UpdatePostDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/post.schema").PostDocument> & import("./schemas/post.schema").Post & import("mongoose").Document<any, any, any> & {
        _id: import("mongoose").Types.ObjectId;
    }) | null>;
    deletePost(user: any, postId: string): Promise<{
        success: boolean;
    }>;
    likePost(user: any, postId: string): Promise<{
        success: boolean;
        likesCount: number | undefined;
    }>;
    unlikePost(user: any, postId: string): Promise<{
        success: boolean;
        likesCount: number | undefined;
    }>;
    repost(user: any, postId: string): Promise<{
        success: boolean;
        reposted: boolean;
        repostsCount: number | undefined;
    }>;
    savePost(user: any, postId: string): Promise<{
        success: boolean;
    }>;
    unsavePost(user: any, postId: string): Promise<{
        success: boolean;
    }>;
    getSaved(user: any, page: number, limit: number): Promise<{
        data: Omit<import("mongoose").Document<unknown, {}, import("./schemas/post.schema").PostDocument> & import("./schemas/post.schema").Post & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        }, never>[];
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    }>;
}
