export interface IUser {
    id: string;
    userName: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    gender: number | null;
    image: string | null;
    isPrivate: boolean;
    isBlocked: boolean;
    blockReason: string | null;
    phoneNumber: string | null;
    birthDate: string | null;
    createdAt: string;
    updatedAt: string | null;
    roles: string[];
}