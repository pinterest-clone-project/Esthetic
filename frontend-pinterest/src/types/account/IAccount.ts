export interface IAccount {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    userName: string;
    phoneNumber: string;
    bio: string;
    isPrivate: boolean;
    isBlocked: boolean;
    blockReason: string | null;
    createdAt: string;
    updatedAt: string;
    roles: string[];
    gender: number;
    birthDate: string;
    country: string | null;
    language: string | null;
    categoryIds: string[];
}