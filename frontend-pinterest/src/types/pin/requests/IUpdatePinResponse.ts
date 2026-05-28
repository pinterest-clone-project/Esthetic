export interface IUpdatePinRequest {
    id: string;
    title?: string;
    description?: string;
    sourceUrl?: string;
    categoryId?: string;
    tagIds?: string[];
}
