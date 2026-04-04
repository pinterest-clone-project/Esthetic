import { useEffect } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {parseError} from "../utils/parseError.ts";

export const useApiError = (error: FetchBaseQueryError | undefined) => {
    useEffect(() => {
        if (!error) return;

        const parsed = parseError(error);

        switch (parsed.status) {
            case 400:
                if (parsed.errors) {
                    Object.values(parsed.errors)
                        .flat()
                        .forEach(msg => console.error(msg));
                } else {
                    console.error(parsed.detail ?? parsed.title);
                }
                break;

            case 401:
                console.error("Сесія закінчилась, увійдіть знову");
                break;

            case 403:
                console.error("У вас немає доступу до цієї дії");
                break;

            case 404:
                console.error(parsed.detail ?? "Ресурс не знайдено");
                break;

            case 500:
                console.error("Помилка сервера, спробуйте пізніше");
                break;

            case 0:
                console.error(parsed.title);
                break;

            default:
                console.error(parsed.title);
        }
    }, [error]);
};