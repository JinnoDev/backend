import { Document, Types } from 'mongoose';
export type PostDocument = Post & Document;
export declare class Post {
    authorId: Types.ObjectId;
    caption: string;
    mediaUrl: string;
    likesCount: number;
    commentsCount: number;
    repostsCount: number;
}
export declare const PostSchema: import("mongoose").Schema<Post, import("mongoose").Model<Post, any, any, any, Document<unknown, any, Post> & Post & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Post, Document<unknown, {}, import("mongoose").FlatRecord<Post>> & import("mongoose").FlatRecord<Post> & {
    _id: Types.ObjectId;
}>;
