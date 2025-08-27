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
        const users = response.data?.data?.Users || response.data?.data?.users || [];

        const mappedUsers = users.map((user: any) => {
            return {
                id: user.UserId || user.userId || user.id || '',
                username: user.username || user.UserName || user.userName || '',
                displayName: user.displayname || user.DisplayName || user.displayName || '',
                avatarUrl: user.avata_url || user.AvatarUrl || user.avatarUrl || '',
                bio: user.bio || user.Bio || '',
                followerCount: user.follower_count || user.FollowerCount || user.followerCount || 0,
                followingCount: user.following_count || user.FollowingCount || user.followingCount || 0
            };
        });

        return {
            data: {
                users: mappedUsers,
                totalCount: response.data?.data?.TotalUsers || response.data?.data?.totalUsers || 0
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
        const cleanUsername = username.replace('@', '');
        const response = await http.privateHttp.get(`Users?SearchTerm=${cleanUsername}&Limit=1`);

        if (!response.data?.success) {
            throw new Error(response.data?.message || `User ${username} not found`);
        }

        const users = response.data?.data?.Users || response.data?.data?.users || [];

        if (users.length === 0) {
            throw new Error(`User ${username} not found`);
        }

        const user = users[0];

        const mappedProfile = {
            id: user.UserId || user.userId || user.id || '',
            username: user.username || user.UserName || user.userName || '',
            displayName: user.displayname || user.DisplayName || user.displayName || '',
            avatarUrl: user.avata_url || user.AvatarUrl || user.avatarUrl || '',
            coverUrl: user.cover_url || user.CoverUrl || user.coverUrl || '',
            bio: user.bio || user.Bio || '',
            followerCount: user.follower_count || user.FollowerCount || user.followerCount || 0,
            followingCount: user.following_count || user.FollowingCount || user.followingCount || 0,
            createdAt: user.created_at || user.CreateAt || user.createdAt || user.CreatedAt,
            updatedAt: user.updated_at || user.UpdateAt || user.updatedAt || user.UpdatedAt,
            email: user.email || user.Email || '',
            role: user.role || user.Role || '',
            isVerified: user.is_verified || user.IsVerified || user.isVerified || false,
            isBanned: user.is_banned || user.IsBanned || user.isBanned || false,
            coin: user.coin || user.Coin || 0,
            blockCoin: user.block_coin || user.BlockCoin || user.blockCoin || 0
        };

        return {
            data: mappedProfile
        };
    } catch (error) {
        throw error;
    }
};
