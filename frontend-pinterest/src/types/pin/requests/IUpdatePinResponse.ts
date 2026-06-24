export interface IUpdatePinRequest {
    id: string;
    imageFile?: File;
    mediaUrl?: string;
    title?: string;
    description?: string;
    sourceUrl?: string;
    categoryId?: string;
    tagIds?: string[];
}
