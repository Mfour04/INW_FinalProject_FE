import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvatarUrl as getAvatarUrlUtil } from '../../../utils/avatar';

interface ClickableUserInfoProps {
    userId?: string;
    username?: string;
    displayName?: string;
    avatarUrl?: string;
    size?: 'small' | 'medium' | 'large';
    showUsername?: boolean;
    className?: string;
}

export const ClickableUserInfo: React.FC<ClickableUserInfoProps> = ({
    userId,
    username,
    displayName,
    avatarUrl,
    size = 'medium',
    showUsername = true,
    className = ''
}) => {
    const navigate = useNavigate();

    const sizeClasses = {
        small: {
            avatar: 'w-6 h-6',
            text: 'text-xs',
            name: 'text-xs',
            username: 'text-xs'
        },
        medium: {
            avatar: 'w-8 h-8',
            text: 'text-sm',
            name: 'text-sm',
            username: 'text-xs'
        },
        large: {
            avatar: 'w-10 h-10',
            text: 'text-base',
            name: 'text-base',
            username: 'text-sm'
        }
    };

    const handleUserClick = () => {
        if (username) {
            try {
                navigate(`/profile/${username}`);
            } catch (error) {
                console.error('Navigation failed:', error);
                window.location.href = `/profile/${username}`;
            }
        } else {
        }
    };

    if (!username) {
        return (
            <div className={`flex items-center space-x-2 ${className}`}>
                <img
                    src={getAvatarUrlUtil(avatarUrl)}
                    alt={displayName || 'User'}
                    className={`${sizeClasses[size].avatar} rounded-full object-cover flex-shrink-0`}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = getAvatarUrlUtil(null);
                    }}
                />
                <div className="min-w-0">
                    <p className={`${sizeClasses[size].name} font-semibold text-white truncate`}>
                        {displayName || 'Người dùng'}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`flex items-center space-x-2 ${className} cursor-pointer hover:opacity-80 transition-opacity`}
            onClick={handleUserClick}
            title={`Xem profile của ${displayName || username}`}
        >
            <img
                src={getAvatarUrlUtil(avatarUrl)}
                alt={displayName || username}
                className={`${sizeClasses[size].avatar} rounded-full object-cover flex-shrink-0`}
                onError={(e) => {
                    (e.target as HTMLImageElement).src = getAvatarUrlUtil(null);
                }}
            />
            <div className="min-w-0">
                <p className={`${sizeClasses[size].name} font-semibold text-white truncate hover:text-orange-400 transition-colors`}>
                    {displayName || username}
                </p>
                {showUsername && (
                    <p className={`${sizeClasses[size].username} text-gray-400 truncate`}>
                        @{username}
                    </p>
                )}
            </div>
        </div>
    );
};
