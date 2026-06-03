import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {IApiError} from "@/types/errors/IApiError.ts";

export const parseError = (error: FetchBaseQueryError): IApiError => {
    if (error.status === "FETCH_ERROR")
        return { status: 0, title: "Немає з'єднання з сервером" };
    if (error.status === "PARSING_ERROR")
        return { status: 0, title: "Помилка парсингу відповіді" };

    const data = error.data as IApiError;
    return {
        status: error.status as number,
        title: data?.title ?? "Невідома помилка",
        detail: data?.detail,
        errors: data?.errors,
    };
};

export const useApiError = (error: FetchBaseQueryError | undefined): IApiError | null => {
    if (!error) return null;
    return parseError(error);
};