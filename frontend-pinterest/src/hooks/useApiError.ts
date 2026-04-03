// hooks/useApiError.ts
import { useEffect } from "react";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";
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
                        .forEach(msg => toast.error(msg));
                } else {
                    toast.error(parsed.detail ?? parsed.title);
                }
                break;

            case 401:
                toast.error("Сесія закінчилась, увійдіть знову");
                break;

            case 403:
                toast.error("У вас немає доступу до цієї дії");
                break;

            case 404:
                toast.error(parsed.detail ?? "Ресурс не знайдено");
                break;

            case 500:
                toast.error("Помилка сервера, спробуйте пізніше");
                break;

            case 0:
                toast.error(parsed.title);
                break;

            default:
                toast.error(parsed.title);
        }
    }, [error]);
};