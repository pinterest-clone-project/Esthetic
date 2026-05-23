export type IEditRequest = {
    firstName?: string;
    lastName?: string;
    email?: string;
    bio?: string | null;
    isPrivate?: boolean;
    phoneNumber?: string | null;
    imageFile?: File | null;
}