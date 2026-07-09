export interface IUpdateCategoryRequest {
    id: string;
    name: string;
    slug: string;
    description?: string;
    imageFile?: File;
}