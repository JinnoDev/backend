import { Document, Types } from 'mongoose';
export type LikeDocument = Like & Document;
export declare class Like {
    userId: Types.ObjectId;
    postId: Types.ObjectId;
}
export declare const LikeSchema: import("mongoose").Schema<Like, import("mongoose").Model<Like, any, any, any, Document<unknown, any, Like> & Like & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Like, Document<unknown, {}, import("mongoose").FlatRecord<Like>> & import("mongoose").FlatRecord<Like> & {
    _id: Types.ObjectId;
}>;
export type RepostDocument = Repost & Document;
export declare class Repost {
    userId: Types.ObjectId;
    postId: Types.ObjectId;
}
export declare const RepostSchema: import("mongoose").Schema<Repost, import("mongoose").Model<Repost, any, any, any, Document<unknown, any, Repost> & Repost & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Repost, Document<unknown, {}, import("mongoose").FlatRecord<Repost>> & import("mongoose").FlatRecord<Repost> & {
    _id: Types.ObjectId;
}>;
export type SaveDocument = Save & Document;
export declare class Save {
    userId: Types.ObjectId;
    postId: Types.ObjectId;
}
export declare const SaveSchema: import("mongoose").Schema<Save, import("mongoose").Model<Save, any, any, any, Document<unknown, any, Save> & Save & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Save, Document<unknown, {}, import("mongoose").FlatRecord<Save>> & import("mongoose").FlatRecord<Save> & {
    _id: Types.ObjectId;
}>;
