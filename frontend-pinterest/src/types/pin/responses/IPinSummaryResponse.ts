export interface IPinSummaryResponse {
    id: string;
    title: string | null;
    image: string;
    likesCount: number;
    isLikedByMe: boolean;
    creatorId: string;
    deletedAt?: string | null;
}
