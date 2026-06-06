import { useEffect } from "react";
import type { UseFormSetError, FieldValues, Path } from "react-hook-form";
import type {IApiError} from "@/types/errors/IApiError.ts";

const serverKeyToField = (key: string): string =>
    key.charAt(0).toLowerCase() + key.slice(1);

export const useFormServerErrors = <T extends FieldValues>(
    apiError: IApiError | null,
    setError: UseFormSetError<T>,
) => {
    useEffect(() => {
        if (!apiError) return;

        if (apiError.errors) {
            for (const [key, messages] of Object.entries(apiError.errors)) {
                const field = serverKeyToField(key) as Path<T>;
                setError(field, {
                    type: "server",
                    message: messages[0],
                });
            }
        }
    }, [apiError, setError]);
};