import React from 'react';
import Button from '@mui/material/Button';
import { useFollow } from '../../../pages/userProfile';

interface FollowButtonProps {
    targetUserId: string;
    enabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    variant?: 'contained' | 'outlined' | 'text';
    className?: string;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
    targetUserId,
    enabled = true,
    size = 'medium',
    variant = 'contained',
    className = '',
}) => {
    const { isFollowing, toggleFollow, isPending } = useFollow(targetUserId, enabled);

    if (!enabled) {
        return null;
    }

    const getButtonStyles = () => {
        const baseStyles = {
            textTransform: 'none' as const,
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: size === 'small' ? '14px' : size === 'large' ? '18px' : '16px',
            boxShadow: 'none',
        };

        if (variant === 'contained') {
            return {
                ...baseStyles,
                backgroundColor: isFollowing ? '#3a3a3a' : '#ff4500',
                color: '#fff',
                '&:hover': {
                    backgroundColor: isFollowing ? '#555' : '#e03e00',
                },
            };
        }

        if (variant === 'outlined') {
            return {
                ...baseStyles,
                backgroundColor: 'transparent',
                color: isFollowing ? '#3a3a3a' : '#ff4500',
                border: `2px solid ${isFollowing ? '#3a3a3a' : '#ff4500'}`,
                '&:hover': {
                    backgroundColor: isFollowing ? '#3a3a3a' : '#ff4500',
                    color: '#fff',
                },
            };
        }

        return baseStyles;
    };

    const getButtonText = () => {
        if (isPending) return 'Đang xử lý...';
        return isFollowing ? 'Bỏ theo dõi' : 'Theo dõi';
    };

    const getButtonWidth = () => {
        switch (size) {
            case 'small':
                return '100px';
            case 'large':
                return '160px';
            default:
                return '140px';
        }
    };

    const getButtonPadding = () => {
        switch (size) {
            case 'small':
                return '4px 16px';
            case 'large':
                return '8px 24px';
            default:
                return '6px 20px';
        }
    };

    return (
        <Button
            onClick={toggleFollow}
            variant={variant}
            disabled={isPending}
            size={size}
            className={className}
            sx={{
                width: getButtonWidth(),
                padding: getButtonPadding(),
                ...getButtonStyles(),
            }}
        >
            {getButtonText()}
        </Button>
    );
};
