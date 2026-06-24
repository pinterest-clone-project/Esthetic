import type {ITagResponse} from "@/types/pin/responses/ITagResponse.ts";


export interface IPinResponse {
    id: string;
    creatorId: string;
    title: string | null;
    description: string | null;
    image: string;
    sourceUrl: string | null;
    categoryId: string | null;
    categoryName: string | null;
    tags: ITagResponse[];
    likesCount: number;
    isLikedByMe: boolean;
    commentsCount: number;
    createdAt: string;
}
