import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FollowUser, UnfollowUser, CheckFollowStatus } from '../../api/UserFollow/user-follow.api';
import type { FollowStatusResponse } from '../../api/UserFollow/user-follow.type';

export const useFollow = (targetUserId: string, enabled: boolean = true) => {
    const queryClient = useQueryClient();

    const { data: followStatus, isLoading, error } = useQuery({
        queryKey: ['followStatus', targetUserId],
        queryFn: () => CheckFollowStatus(targetUserId),
        enabled: enabled && !!targetUserId,
    });

    const followMutation = useMutation({
        mutationFn: FollowUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followStatus', targetUserId] });
            queryClient.invalidateQueries({ queryKey: ['followers'] });
            queryClient.invalidateQueries({ queryKey: ['following'] });
            queryClient.invalidateQueries({ queryKey: ['otherUserProfile'] });
            queryClient.invalidateQueries({ queryKey: ['currentUserInfo'] });
        },
        onError: (error) => {
            console.error('=== FOLLOW MUTATION ERROR ===');
            console.error('Follow error:', error);
        },
    });

    const unfollowMutation = useMutation({
        mutationFn: UnfollowUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['followStatus', targetUserId] });
            queryClient.invalidateQueries({ queryKey: ['followers'] });
            queryClient.invalidateQueries({ queryKey: ['following'] });
            queryClient.invalidateQueries({ queryKey: ['otherUserProfile'] });
            queryClient.invalidateQueries({ queryKey: ['currentUserInfo'] });
        },
        onError: (error) => {
            console.error('=== UNFOLLOW MUTATION ERROR ===');
            console.error('Unfollow error:', error);
        },
    });

    const isFollowing =
        followStatus?.data?.data?.isFollowing ||
        followStatus?.data?.isFollowing ||
        followStatus?.isFollowing ||
        false;

    const isFollowedBy =
        followStatus?.data?.data?.isFollowedBy ||
        followStatus?.data?.isFollowedBy ||
        followStatus?.isFollowedBy ||
        false;

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



