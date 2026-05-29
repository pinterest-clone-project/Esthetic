import type { ITagResponse } from "../../tag/responses/ITagResponse.ts";

export interface IPinResponse {
    id: string;
    creatorId: string;
    title: string | null;
    description: string | null;
    mediaUrl: string | null;
    sourceUrl: string | null;
    categoryId: string | null;
    categoryName: string | null;
    tags: ITagResponse[];
    likesCount: number;
    commentsCount: number;
    createdAt: string;
}
