export interface UpdateUserProfileRequest {
    UserId: string;
    DisplayName: string;
    Bio: string;
    AvatarUrl?: File;
    CoverUrl?: File;
    BadgeId?: string[];
    FavouriteType?: string[];
}

export interface ChangePasswordRequest {
    UserId: string;
    OldPassword: string;
    NewPassword: string;
    ConfirmPassword: string;
}

export interface UserProfileData {
    id: string;
    username: string;
    displayname: string;
    bio: string;
    AvatarUrl: string;
    CoverUrl: string;
    badge_id: string[];
    favourite_type: string[];
    createdAt: number;
    updatedAt: number;
}

export interface ApiResponse {
    Success?: boolean;
    Message?: string;
    Data?: any;
    success?: boolean;
    message?: string;
    data?: any;
}

export interface UpdateUserProfileResponse {
    UserId: string;
    DisplayName: string;
    Bio: string;
    AvatarUrl: string;
    CoverUrl: string;
}

export interface UpdateUserProfileSuccessResponse {
    success: boolean;
    message: string;
    data: {
        UserId: string;
        DisplayName: string;
        Bio: string;
        AvatarUrl: string;
        CoverUrl: string;
    };
}
