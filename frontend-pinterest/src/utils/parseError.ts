import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {IApiError} from "../types/errors/IApiError.ts";
import APP_CONSTANTS from "../constants/common";

export const parseError = (error: FetchBaseQueryError): IApiError => {
    if (error.status === APP_CONSTANTS.FETCH_ERROR) {
        return { status: 0, title: "Немає з'єднання з сервером" };
    }

    if (error.status === APP_CONSTANTS.PARSING_ERROR) {
        return { status: 0, title: "Помилка парсингу відповіді" };
    }

    const data = error.data as IApiError;

    return {
        status: error.status as number,
        title: data?.title ?? "Невідома помилка",
        detail: data?.detail,
        errors: data?.errors,
    };
};