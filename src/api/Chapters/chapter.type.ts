export interface Chapter {
    novelId: string;
    title: string;
    content: string;
    chapterNumber: number;
    isPaid: boolean;
    price: number;
    isDraft: boolean;
    isPublic: boolean;
}

export interface ChapterByNovel {
    id: string;
    novel_id: string;
    title: string;
    content: string;
    chapter_number: number;
    is_paid: boolean;
    price: number;
    scheduled_at: number;
    is_lock: boolean;
    is_draft: boolean;
    is_public: boolean;
    created_at: number;
    updated_at: number;
}

export type ChapterCreatePayload = Omit<Chapter, 'novelId'>;

export type Chapters = {
    success: boolean,
    message: string,
    data: Chapter
}

export type NovelChapters = {
    success: boolean,
    message: string,
    data: ChapterByNovel[]
}

export interface PublishStatus {
    Draft: 'DRAFT',
    Private: 'PRIVATE',
    Public: 'PUBLIC',
}

