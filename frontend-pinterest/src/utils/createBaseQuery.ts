import {
    type BaseQueryFn,
    fetchBaseQuery,
    type FetchArgs,
    type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { APP_ENV } from "../constants/env";
import { Mutex } from "async-mutex";
import {clearUser} from "@/store/slices/authSlice.ts";
import i18n from "@/i18n";

const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${APP_ENV.API_BASE_URL}/api/`,
    credentials: "include",
    prepareHeaders: (headers) => {
        headers.set("Accept-Language", i18n.language || "uk");
        return headers;
    },
    paramsSerializer: (params) => {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value === undefined || value === null) continue;
            if (Array.isArray(value)) {
                value.forEach(v => search.append(key, String(v)));
            } else {
                search.append(key, String(value));
            }
        }
        return search.toString();
    },
});

export const createBaseQuery = (
    endpoint: string
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
    return async (args, api, extraOptions) => {
        const normalizedArgs: FetchArgs =
            typeof args === "string"
                ? { url: `${endpoint}/${args}` }
                : { ...args, url: `${endpoint}/${args.url}` };

        await mutex.waitForUnlock();
        let result = await rawBaseQuery(normalizedArgs, api, extraOptions);

        if (result.error?.status !== 401) {
            return result;
        }

        const url = typeof args === "string" ? args : args.url ?? "";
        const skipRefresh = ["Account/refresh", "Account/login"]
            .some(u => url.includes(u));

        if (skipRefresh) {
            return result;
        }

        if (mutex.isLocked()) {
            await mutex.waitForUnlock();
            return rawBaseQuery(normalizedArgs, api, extraOptions);
        }

        const release = await mutex.acquire();

        try {
            const refreshResult = await rawBaseQuery(
                { url: "Account/refresh", method: "POST" },
                api,
                extraOptions
            );

            if (!refreshResult.error) {
                result = await rawBaseQuery(normalizedArgs, api, extraOptions);
            } else {
                api.dispatch(clearUser());
            }
        } finally {
            release();
        }

        return result;
    };
};