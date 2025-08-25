import { useBlockedUsers } from '../context/BlockedUsersContext/BlockedUsersProvider';

export const useContentFilter = () => {
    const { isUserBlocked } = useBlockedUsers();

    const filterPosts = <T extends { author?: { id?: string; userId?: string } }>(posts: T[]): T[] => {
        return posts.filter(post => {
            const authorId = post.author?.id || post.author?.userId;
            return !authorId || !isUserBlocked(authorId);
        });
    };

    const filterComments = <T extends { author?: { id?: string; userId?: string } }>(comments: T[]): T[] => {
        return comments.filter(comment => {
            const authorId = comment.author?.id || comment.author?.userId;
            return !authorId || !isUserBlocked(authorId);
        });
    };

    const filterReviews = <T extends { author?: { id?: string; userId?: string } }>(reviews: T[]): T[] => {
        return reviews.filter(review => {
            const authorId = review.author?.id || review.author?.userId;
            return !authorId || !isUserBlocked(authorId);
        });
    };

    const isBlocked = (userId: string): boolean => {
        return isUserBlocked(userId);
    };

    return {
        filterPosts,
        filterComments,
        filterReviews,
        isBlocked,
    };
};
