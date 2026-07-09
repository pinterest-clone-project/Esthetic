export interface ICreateCategoryRequest {
    name: string;
    slug: string;
    description?: string;
    imageFile: File;
}