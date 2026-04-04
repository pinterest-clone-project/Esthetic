import {
    type BaseQueryFn,
    fetchBaseQuery,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import {storage} from "./storage.ts";
import {APP_ENV} from "../constants/env";
import type {ITokenResponse} from "../types/account/responses/ITokenResponse.ts";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${APP_ENV.API_BASE_URL}/api/`,
    prepareHeaders: (headers) => {
        const token = storage.getAccessToken();
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

export const createBaseQuery = (endpoint: string): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
    return async (args, api, extraOptions) => {
        const normalizedArgs: FetchArgs =
            typeof args === "string"
                ? { url: `${endpoint}/${args}` }
                : { ...args, url: `${endpoint}/${args.url}` };

        let result = await rawBaseQuery(normalizedArgs, api, extraOptions);

        if (result.error?.status !== 401) {
            return result;
        }

        const refreshToken = storage.getRefreshToken();

        if (!refreshToken) {
            storage.clearAuth();
            return result;
        }

        const refreshResult = await rawBaseQuery(
            {
                url: "Account/refresh",
                method: "POST",
                body: { refreshToken },
            },
            api,
            extraOptions
        );

        if (refreshResult.data) {
            const tokens = refreshResult.data as ITokenResponse;
            storage.setAuth(tokens);

            result = await rawBaseQuery(
                {
                    ...normalizedArgs,
                    headers: {
                        ...(normalizedArgs.headers ?? {}),
                        authorization: `Bearer ${tokens.accessToken}`,
                    },
                },
                api,
                extraOptions
            );

            return result;
        }

        storage.clearAuth();
        return result;
    };
};