export interface UserFollowResponse {
    id: string;
    actorId: string;
    targetId: string;
    createdAt: number;
    actor: UserInfo;
    target: UserInfo;
}

export interface UserInfo {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
    followerCount: number;
    followingCount: number;
}

export interface FollowStatusResponse {
    isFollowing: boolean;
    isFollowedBy: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}
