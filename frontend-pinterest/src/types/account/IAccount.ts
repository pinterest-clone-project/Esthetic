export interface IAccount {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    username: string;
    phoneNumber: string;
    bio: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    roles: string[];
    gender: number;
    birthDate: string;
}