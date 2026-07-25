export interface IUpdateNewsRequest {
    id: string;
    titleUk: string;
    titleEn: string;
    excerptUk: string;
    excerptEn: string;
    tag: string;
    imageFile?: File;
    publishedAt: string;
    isFeatured: boolean;
}
