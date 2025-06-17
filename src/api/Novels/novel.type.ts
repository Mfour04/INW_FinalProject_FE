export interface Novel {
    title: string,
    description: string,
    authorId: string,
    tags: Array<string>,
    status: number,
    isPublic: boolean,
    isPaid: boolean,
    purchaseType: number,
    price: number,
    totalChapters: number,
    totalViews: number,
    followers: number,
    ratingAvg: number,
    ratingCount: number
}

export type Novels = {
    success: boolean,
    message: string,
    data: Novel[]
}