export declare class UpdateProfileDto {
    name?: string;
    bio?: string;
    avatar?: string;
}
export interface IUser {
    id: string;
    email: string;
    username: string;
    name: string;
    bio: string;
    avatar: string;
    followersCount: number;
    followingCount: number;
    createdAt: Date;
}
