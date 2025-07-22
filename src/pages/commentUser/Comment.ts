export interface Comment {
    id: string;
    avatarUrl?: string | null;
    name: string;
    user: string;
    timestamp: string;
    content: string;
    likes: number;
    replies: number;
    parentId?: string | null;
    novelId?: string;
    chapterId?: string;
}
