import React, { useState } from 'react';
import { useBlockedUsers } from '../../../context/BlockedUsersContext/BlockedUsersProvider';
import { getAvatarUrl } from '../../../utils/avatar';

interface BlockUserButtonProps {
    targetUserId: string;
    targetUserName: string;
    targetDisplayName: string;
    targetAvatar?: string;
    variant?: 'button' | 'menu-item';
    onBlock?: () => void;
    onUnblock?: () => void;
    className?: string;
}

export const BlockUserButton: React.FC<BlockUserButtonProps> = ({
    targetUserId,
    targetUserName,
    targetDisplayName,
    targetAvatar,
    variant = 'button',
    onBlock,
    onUnblock,
    className = '',
}) => {
    const { blockUser, unblockUser, isUserBlocked, isLoading } = useBlockedUsers();
    const [isConfirming, setIsConfirming] = useState(false);

    const isBlocked = isUserBlocked(targetUserId);

    const handleBlock = async () => {
        if (isConfirming) {
            try {
                await blockUser(targetUserId);
                onBlock?.();
            } catch (error) {
                console.error('Error blocking user:', error);
            } finally {
                setIsConfirming(false);
            }
        } else {
            setIsConfirming(true);
            setTimeout(() => setIsConfirming(false), 3000);
        }
    };

    const handleUnblock = async () => {
        try {
            await unblockUser(targetUserId);
            onUnblock?.();
        } catch (error) {
            console.error('Error unblocking user:', error);
        }
    };

    if (variant === 'menu-item') {
        return (
            <button
                onClick={isBlocked ? handleUnblock : handleBlock}
                disabled={isLoading}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm text-left hover:bg-gray-700 rounded transition-colors ${className}`}
            >
                {isBlocked ? (
                    <>
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Bỏ chặn người dùng</span>
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                        </svg>
                        <span>Chặn người dùng</span>
                    </>
                )}
            </button>
        );
    }

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {isBlocked ? (
                <button
                    onClick={handleUnblock}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Bỏ chặn</span>
                </button>
            ) : (
                <button
                    onClick={handleBlock}
                    disabled={isLoading || isConfirming}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded transition-colors ${isConfirming
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                    </svg>
                    <span>{isConfirming ? 'Xác nhận chặn' : 'Chặn người dùng'}</span>
                </button>
            )}
        </div>
    );
};
