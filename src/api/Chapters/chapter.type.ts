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

export type ChapterCreatePayload = Omit<Chapter, 'novelId'>;

export type Chapters = {
    success: boolean,
    message: string,
    data: Chapter
}

export interface PublishStatus {
    Draft: 'DRAFT',
    Private: 'PRIVATE',
    Public: 'PUBLIC',
}

