export interface IRegisterRequest {
    UserName: string;
    FirstName: string;
    LastName: string;
    Bio?: string;
    Email: string;
    Password: string;
    PhoneNumber?: string;
    BirthDate: string;
    Gender?: number;
    Country?: string;
    Language?: string;
    CategoryIds?: string[];
    ImageFile?: File | null;
    IsPrivate?: boolean;
}