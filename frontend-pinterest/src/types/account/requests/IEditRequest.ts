export interface IEditRequest {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
    birthDate?: string | null;
    gender?: number;
    isPrivate?: boolean;
    imageFile?: File;
    country?: string | null;
    language?: string | null;
    categoryIds?: string[];
}