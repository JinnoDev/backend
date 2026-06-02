import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(q: string, page: number, limit: number): Promise<{
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
