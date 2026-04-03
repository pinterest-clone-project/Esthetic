import {api} from "./api.ts";
import type {ITokenResponse} from "../types/account/responses/ITokenResponse.ts";
import type {ILoginRequest} from "../types/account/requests/ILoginRequest.ts";
import type {IRegisterRequest} from "../types/account/requests/IRegisterRequest.ts";
import type {IEditRequest} from "../types/account/requests/IEditRequest.ts";
import type {IForgotPasswordRequest} from "../types/account/requests/IForgotPasswordRequest.ts";
import type {IResetPasswordRequest} from "../types/account/requests/IResetPasswordRequest.ts";
import type {IRefreshRequest} from "../types/account/requests/IRefreshRequest.ts";
import {serialize} from "object-to-formdata";

export const accountService = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ITokenResponse, ILoginRequest>({
            query: (credentials) => ({
                url: 'Account/login',
                method: 'POST',
                body: credentials
            }),
        }),

        register: builder.mutation<ITokenResponse, IRegisterRequest>({
            query: (credentials) => {
                const formData = serialize(credentials);

                return {
                    url: 'Account/register',
                    method: 'POST',
                    body: formData
                };
            },
        }),

        editProfile: builder.mutation<ITokenResponse, IEditRequest>({
            query: (data) => ({
                url: 'Account/edit',
                method: 'PUT',
                body: serialize(data),
            }),
        }),

        forgotPassword: builder.mutation<void, IForgotPasswordRequest>({
            query: (model) => ({
                url: 'Account/forgot-password',
                method: 'POST',
                body: model
            })
        }),

        resetPassword: builder.mutation<void, IResetPasswordRequest>({
            query: (model) => ({
                url: 'Account/reset-password',
                method: 'POST',
                body: model
            })
        }),
        refresh: builder.mutation<ITokenResponse, IRefreshRequest>({
            query: (body) => ({
                url: 'Account/refresh',
                method: 'POST',
                body
            })
        }),

    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useEditProfileMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useRefreshMutation,
} = accountService;

