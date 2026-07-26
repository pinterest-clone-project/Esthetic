export interface ICreateNewsRequest {
    titleUk: string;
    titleEn: string;
    excerptUk: string;
    excerptEn: string;
    tag: string;
    imageFile?: File;
    content?: string;
    publishedAt: string;
    isFeatured: boolean;
}
