import http from "../../utils/http";

export const FollowUser = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.post(`follows/${targetUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UnfollowUser = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.delete(`follows/${targetUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetFollowers = async (userId: string) => {
    try {
        const response = await http.privateHttp.get(`follows/${userId}/followers`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetFollowing = async (userId: string) => {
    try {
        const response = await http.privateHttp.get(`follows/${userId}/following`);

        if (response.data?.data) {
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const CheckFollowStatus = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.get(`follows/status/${targetUserId}`);

        if (response.data?.data) {
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const BlockUser = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.post(`follows/blocks/${targetUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UnblockUser = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.delete(`follows/blocks/${targetUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetBlockedUsers = async () => {
    try {
        const response = await http.privateHttp.get(`follows/blocks`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const clearMockBlockedUsers = () => {
    localStorage.removeItem('mock_blocked_users');
};

export const resetMockBlockedUsers = () => {
    localStorage.removeItem('mock_blocked_users');
    return {
        success: true,
        message: 'All mock data cleared successfully',
        data: []
    };
};

export const CheckBlockStatus = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.get(`follows/blocks/status/${targetUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
