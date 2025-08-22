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
