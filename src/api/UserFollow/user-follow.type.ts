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

export interface BlockedUser {
    id: string;
    userId: string;
    blockedUserId: string;
    blockedUser: {
        id: string;
        userName: string;
        displayName: string;
        avatar?: string;
    };
    blockedAt: string;
}

export interface BlockUserRequest {
    targetUserId: string;
}

export interface BlockUserResponse {
    success: boolean;
    message: string;
    data?: BlockedUser;
}

export interface UnblockUserRequest {
    targetUserId: string;
}

export interface UnblockUserResponse {
    success: boolean;
    message: string;
}

export interface GetBlockedUsersResponse {
    success: boolean;
    message: string;
    data: BlockedUser[];
}

export interface CheckBlockStatusResponse {
    success: boolean;
    message: string;
    data: {
        isBlocked: boolean;
        blockedByMe: boolean;
        blockedByUser: boolean;
    };
}
