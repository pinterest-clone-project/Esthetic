export interface ICreatePinRequest {
    mediaUrl: string;
    title?: string;
    description?: string;
    sourceUrl?: string;
    categoryId?: string;
    tagIds?: string[];
}
