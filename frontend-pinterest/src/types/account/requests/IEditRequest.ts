export interface IEditRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string;
    isPrivate?: boolean;
    phoneNumber?: string;
    imageFile?: File | null;
}