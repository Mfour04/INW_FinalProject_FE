import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetCurrentUserInfo, UpdateUserProfile, ChangePassword } from "../../api/User/user-settings.api";
import type { UpdateUserProfileRequest, ChangePasswordRequest, UserProfileData, ApiResponse } from "../../api/User/user-settings.type";
import { useAuth } from "../../hooks/useAuth";

export const useGetCurrentUserInfo = () => {
    return useQuery({
        queryKey: ["current-user-info"],
        queryFn: GetCurrentUserInfo,
        retry: 3,
        retryDelay: 1000,
        staleTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchInterval: false,
        enabled: true,
        placeholderData: undefined,
    });
};

export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
    const { auth, setAuth } = useAuth();

    return useMutation({
        mutationFn: (data: FormData) => UpdateUserProfile(data),
        onSuccess: async (result) => {
            await queryClient.removeQueries({ queryKey: ["current-user-info"] });

            setTimeout(async () => {
                await queryClient.refetchQueries({ queryKey: ["current-user-info"] });
            }, 500);

            let backendData = null;

            if (result?.data?.Data) {
                backendData = result.data.Data;
            } else if (result?.data?.data) {
                backendData = result.data.data;
            } else if (result?.data) {
                backendData = result.data;
            }

            if (backendData && auth?.user) {
                const normalizedData = {
                    DisplayName: backendData.DisplayName || backendData.displayName,
                    Bio: backendData.Bio || backendData.bio,
                    AvatarUrl: backendData.AvatarUrl || backendData.avatarUrl,
                    CoverUrl: backendData.CoverUrl || backendData.coverUrl,
                };

                const updatedUser = {
                    ...auth.user,
                    displayName: normalizedData.DisplayName || auth.user.displayName,
                    bio: normalizedData.Bio || auth.user.bio,
                    avatarUrl: normalizedData.AvatarUrl || auth.user.avatarUrl,
                    coverUrl: normalizedData.CoverUrl || auth.user.coverUrl,
                };

                const updatedAuth = {
                    ...auth,
                    user: updatedUser
                };

                setAuth(updatedAuth);
                queryClient.invalidateQueries({ queryKey: ["auth"] });
            }
        },
        onError: (error: any) => {
            console.error("Profile update failed:", error);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
        }
    });
};

export const useChangePassword = () => {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) => ChangePassword(data),
        onError: (error: any) => {
            console.error("Password change failed:", error);
        }
    });
};
