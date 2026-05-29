import { api } from "./api.ts";
import type { IAccount } from "../types/account/IAccount.ts";
import type { ILoginRequest } from "../types/account/requests/ILoginRequest.ts";
import type { IRegisterRequest } from "../types/account/requests/IRegisterRequest.ts";
import type { IEditRequest } from "../types/account/requests/IEditRequest.ts";
import type { IForgotPasswordRequest } from "../types/account/requests/IForgotPasswordRequest.ts";
import type { IResetPasswordRequest } from "../types/account/requests/IResetPasswordRequest.ts";
import { serialize } from "object-to-formdata";
import { serializePatch } from "../utils/serializePatch.ts";

export const accountService = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<IAccount, ILoginRequest>({
            query: (credentials) => ({
                url: "Account/login",
                method: "POST",
                body: credentials,
            }),
        }),

        register: builder.mutation<IAccount, IRegisterRequest>({
            query: (credentials) => ({
                url: "Account/register",
                method: "POST",
                body: serialize(credentials),
            }),
        }),

        editProfile: builder.mutation<IAccount, IEditRequest>({
            query: (data) => ({
                url: "Account/edit",
                method: "PATCH",
                body: serializePatch(data),
            }),
        }),

        forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
            query: (model) => ({
                url: "Account/forgot-password",
                method: "POST",
                body: model,
            }),
        }),

        resetPassword: builder.mutation<void, IResetPasswordRequest>({
            query: (model) => ({
                url: "Account/reset-password",
                method: "POST",
                body: model,
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: "Account/logout",
                method: "POST",
            }),
        }),

        getMe: builder.query<IAccount, void>({
            query: () => "Account/me",
        }),

        googleLogin: builder.mutation<IAccount, { token: string }>({
            query: (body) => ({
                url: "Account/google",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useEditProfileMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogoutMutation,
    useGetMeQuery,
    useGoogleLoginMutation,
} = accountService;