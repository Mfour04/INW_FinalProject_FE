import http from "../../utils/http";

export const SearchUsers = async (query: string) => {
    if (query.length < 2) {
        return {
            data: {
                users: [],
                totalCount: 0
            }
        };
    }

    try {
        const response = await http.privateHttp.get(`Users?SearchTerm=${query}&Limit=10`);
        const users = response.data?.data?.users || [];

        const mappedUsers = users.map((user: any) => {
            return {
                id: user.userId || user.UserId || user.id || '',
                username: user.userName || user.UserName || user.username || '',
                displayName: user.displayName || user.DisplayName || '',
                avatarUrl: user.avatarUrl || user.AvatarUrl || '',
                bio: user.bio || user.Bio || '',
                followerCount: user.followerCount || user.FollowerCount || 0,
                followingCount: user.followingCount || user.FollowingCount || 0
            };
        });

        return {
            data: {
                users: mappedUsers,
                totalCount: response.data?.data?.totalUsers || 0
            }
        };
    } catch (error) {
        return {
            data: {
                users: [],
                totalCount: 0
            }
        };
    }
};

export const GetUserProfile = async (username: string) => {
    try {
        const response = await http.privateHttp.get(`Users?SearchTerm=${username}&Limit=1`);
        const users = response.data?.data?.users || [];

        if (users.length === 0) {
            throw new Error(`User ${username} not found`);
        }

        const user = users[0];

        const mappedProfile = {
            id: user.userId || user.UserId,
            username: user.userName || user.UserName,
            displayName: user.displayName || user.DisplayName,
            avatarUrl: user.avatarUrl || user.AvatarUrl,
            coverUrl: user.coverUrl || user.CoverUrl,
            bio: user.bio || user.Bio,
            followerCount: user.followerCount || user.FollowerCount || 0,
            followingCount: user.followingCount || user.FollowingCount || 0,
            createdAt: user.createdAt || user.CreatedAt,
            updatedAt: user.updatedAt || user.UpdatedAt,
            email: user.email || user.Email,
            role: user.role || user.Role,
            isVerified: user.isVerified || user.IsVerified,
            isBanned: user.isBanned || user.IsBanned,
            coin: user.coin || user.Coin || 0,
            blockCoin: user.blockCoin || user.BlockCoin || 0
        };

        return {
            data: mappedProfile
        };
    } catch (error) {
        throw error;
    }
};
