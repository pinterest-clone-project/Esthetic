import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {IApiError} from "@/types/errors/IApiError.ts";

export const parseError = (error: FetchBaseQueryError): IApiError => {
    if (error.status === "FETCH_ERROR")
        return { status: 0, title: "No server connection" };
    if (error.status === "PARSING_ERROR")
        return { status: 0, title: "Response parsing error" };

    const data = error.data as IApiError;
    return {
        status: error.status as number,
        title: data?.title ?? "Unknown error",
        detail: data?.detail,
        errors: data?.errors,
    };
};

export const useApiError = (error: FetchBaseQueryError | undefined): IApiError | null => {
    if (!error) return null;
    return parseError(error);
};