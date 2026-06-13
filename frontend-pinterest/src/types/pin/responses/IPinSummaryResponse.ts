export interface IPinSummaryResponse {
    id: string;
    title: string | null;
    mediaUrl: string | null;
    likesCount: number;
    isLikedByMe: boolean;
}
