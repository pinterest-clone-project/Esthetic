export type IEditRequest = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    bio?: string | null;
    phoneNumber?: string | null;
    gender?: number | null;
    birthDate?: string | null;
    isPrivate?: boolean | null;
    imageFile?: File | null;
}