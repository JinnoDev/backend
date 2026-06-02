export declare class CreateCommentDto {
    text: string;
}
export interface IComment {
    id: string;
    postId: string;
    authorId: string;
    text: string;
    createdAt: Date;
}
