import http from "../../utils/http";

export const FollowUser = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.post(`UserFollow/follow`, {
            targetUserId: targetUserId
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const UnfollowUser = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.delete(`UserFollow/unfollow/${targetUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetFollowers = async (userId: string) => {
    try {
        const response = await http.privateHttp.get(`UserFollow/followers/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const GetFollowing = async (userId: string) => {
    try {
        const response = await http.privateHttp.get(`UserFollow/following/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const CheckFollowStatus = async (targetUserId: string) => {
    try {
        const response = await http.privateHttp.get(`UserFollow/status/${targetUserId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
