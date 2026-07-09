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
    ImageFile?: File | null;
}