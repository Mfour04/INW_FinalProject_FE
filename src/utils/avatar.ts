import defaultAvatar from '../assets/img/default_avt.png';

export const getAvatarUrl = (avatarUrl: string | null | undefined): string => {
    if (!avatarUrl || avatarUrl.trim() === '') {
        return defaultAvatar;
    }
    return avatarUrl;
};

export const hasCustomAvatar = (avatarUrl: string | null | undefined): boolean => {
    return !!(avatarUrl && avatarUrl.trim() !== '');
};

export const getAvatarDisplayUrl = (avatarUrl: string | null | undefined): string => {
    if (!avatarUrl || avatarUrl.trim() === '') {
        return defaultAvatar;
    }

    if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
        return avatarUrl;
    }

    return avatarUrl;
};
