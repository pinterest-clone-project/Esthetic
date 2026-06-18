export interface IUpdatePinRequest {
    id: string;
    title?: string;
    description?: string;
    sourceUrl?: string;
    mediaUrl?: string;
    categoryId?: string;
    tagIds?: string[];
}
