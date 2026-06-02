export declare class CreatePostDto {
    caption: string;
    media?: any;
}
export declare class UpdatePostDto {
    caption?: string;
}
export declare enum PostFilter {
    FEED = "feed",
    RECOMMENDED = "recommended"
}
export declare class GetPostsQueryDto {
    filter?: PostFilter;
}
export interface IPost {
    id: string;
    authorId: string;
    caption: string;
    mediaUrl: string;
    likesCount: number;
    commentsCount: number;
    repostsCount: number;
    createdAt: Date;
    updatedAt: Date;
}
