import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FollowUser, UnfollowUser, CheckFollowStatus } from '../../api/UserFollow/user-follow.api';
import type { FollowStatusResponse } from '../../api/UserFollow/user-follow.type';

export const useFollow = (targetUserId: string, enabled: boolean = true) => {
    const queryClient = useQueryClient();

    const { data: followStatus, isLoading } = useQuery({
        queryKey: ['followStatus', targetUserId],
        queryFn: () => CheckFollowStatus(targetUserId),
        enabled: enabled && !!targetUserId,
    });

    const followMutation = useMutation({
        mutationFn: FollowUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followStatus', targetUserId] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: UnfollowUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followStatus', targetUserId] });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        },
    });

    const isFollowing = followStatus?.data?.data?.isFollowing || false;
    const isFollowedBy = followStatus?.data?.data?.isFollowedBy || false;

    const follow = () => {
        if (!isFollowing) {
            followMutation.mutate(targetUserId);
        }
    };

    const unfollow = () => {
        if (isFollowing) {
            unfollowMutation.mutate(targetUserId);
        }
    };

    const toggleFollow = () => {
        if (isFollowing) {
            unfollow();
        } else {
            follow();
        }
    };

    return {
        isFollowing,
        isFollowedBy,
        isLoading,
        follow,
        unfollow,
        toggleFollow,
        isPending: followMutation.isPending || unfollowMutation.isPending,
    };
};
