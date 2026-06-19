export interface IRegisterRequest {
    UserName: string;
    FirstName: string;
    LastName: string;
    Bio?: string;
    Email: string;
    Password: string;
    BirthDate: string;
    PhoneNumber?: string;
    ImageFile?: File | null;
}
