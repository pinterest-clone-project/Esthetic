export interface IResetPasswordRequest {
    email: string
    code: string
    newPassword: string
}