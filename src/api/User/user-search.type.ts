export interface UserSearchResult {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    bio: string;
    followerCount: number;
    followingCount: number;
    isFollowing?: boolean;
}

export interface UserSearchResponse {
    users: UserSearchResult[];
    totalCount: number;
}

export interface UserProfileResponse {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string;
    coverUrl: string;
    bio: string;
    followerCount: number;
    followingCount: number;
    createdAt: number;
    isFollowing?: boolean;
    isCurrentUser?: boolean;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}
