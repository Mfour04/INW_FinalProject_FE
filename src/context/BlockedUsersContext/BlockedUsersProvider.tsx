import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetBlockedUsers, BlockUser, UnblockUser, CheckBlockStatus } from '../../api/UserFollow/user-follow.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ToastContext/toast-context';
import type { BlockedUser } from '../../api/UserFollow/user-follow.type';

interface BlockedUsersContextType {
    blockedUsers: BlockedUser[];
    isLoading: boolean;
    blockUser: (targetUserId: string) => Promise<void>;
    unblockUser: (targetUserId: string) => Promise<void>;
    isUserBlocked: (targetUserId: string) => boolean;
    isBlockedByUser: (targetUserId: string) => boolean;
    refreshBlockedUsers: () => void;
}

const BlockedUsersContext = createContext<BlockedUsersContextType | undefined>(undefined);

export const useBlockedUsers = () => {
    const context = useContext(BlockedUsersContext);
    if (!context) {
        throw new Error('useBlockedUsers must be used within a BlockedUsersProvider');
    }
    return context;
};

interface BlockedUsersProviderProps {
    children: ReactNode;
}

export const BlockedUsersProvider: React.FC<BlockedUsersProviderProps> = ({ children }) => {
    const { auth } = useAuth();
    const toast = useToast();
    const queryClient = useQueryClient();

    const { data: blockedUsersData, isLoading, refetch } = useQuery({
        queryKey: ['blocked-users'],
        queryFn: GetBlockedUsers,
        enabled: !!auth?.user?.userId,
        staleTime: 1000 * 60 * 5,
    });

    const blockedUsers = blockedUsersData?.data || [];

    useEffect(() => {
        if (blockedUsers.length > 0) {
        }
    }, [blockedUsersData, blockedUsers]);

    const blockUserMutation = useMutation({
        mutationFn: BlockUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
            toast?.onOpen('Đã chặn người dùng thành công!');
        },
        onError: (error: any) => {
            console.error('Error blocking user:', error);
            toast?.onOpen('Có lỗi xảy ra khi chặn người dùng!');
        },
    });

    const unblockUserMutation = useMutation({
        mutationFn: UnblockUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blocked-users'] });
            toast?.onOpen('Đã bỏ chặn người dùng thành công!');
        },
        onError: (error: any) => {
            console.error('Error unblocking user:', error);
            toast?.onOpen('Có lỗi xảy ra khi bỏ chặn người dùng!');
        },
    });

    const blockUser = async (targetUserId: string) => {
        if (!auth?.user?.userId) {
            toast?.onOpen('Vui lòng đăng nhập để thực hiện thao tác này!');
            return;
        }

        try {
            await blockUserMutation.mutateAsync(targetUserId);
        } catch (error) {
            console.error('Error in blockUser:', error);
            throw error;
        }
    };

    const unblockUser = async (targetUserId: string) => {
        if (!auth?.user?.userId) {
            toast?.onOpen('Vui lòng đăng nhập để thực hiện thao tác này!');
            return;
        }
        await unblockUserMutation.mutateAsync(targetUserId);
    };

    const isUserBlocked = (targetUserId: string): boolean => {
        const isBlocked = blockedUsers.some((blocked: any) => {
            const match = blocked.blockedUserId === targetUserId ||
                blocked.blockedUser?.userName === targetUserId ||
                blocked.blockedUser?.id === targetUserId;

            if (match) {
            }
            return match;
        });

        return isBlocked;
    };

    const isBlockedByUser = (targetUserId: string): boolean => {
        return false;
    };

    const refreshBlockedUsers = () => {
        refetch();
    };

    const value: BlockedUsersContextType = {
        blockedUsers,
        isLoading,
        blockUser,
        unblockUser,
        isUserBlocked,
        isBlockedByUser,
        refreshBlockedUsers,
    };

    return (
        <BlockedUsersContext.Provider value={value}>
            {children}
        </BlockedUsersContext.Provider>
    );
};
