export interface IPinSummaryResponse {
    id: string;
    title: string | null;
    image: string;
    likesCount: number;
    isLikedByMe: boolean;
    creatorId: string;
    deletedAt?: string | null;
    categoryName: string | null;
    commentsCount: number;
    tagsCount: number;
}
