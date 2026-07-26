export interface INews {
    id: string;
    titleUk: string;
    titleEn: string;
    excerptUk: string;
    excerptEn: string;
    tag: string;
    image: string | null;
    content: string | null;
    publishedAt: string;
    isFeatured: boolean;
}
