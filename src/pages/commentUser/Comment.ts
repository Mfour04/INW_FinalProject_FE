export interface Comment {
    id: number;
    avatar?: string;
    name: string;
    user: string;
    timestamp: string;
    content: string;
    likes: number;
    replies: number;
    parentId?: number;
}