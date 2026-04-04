import { jwtDecode } from "jwt-decode";
import APP_CONSTANTS from "../constants/common";
import type {IAccount} from "../types/account/IAccount.ts";

export const parseToken = (token: string): IAccount | null => {
    try {
        const decoded = jwtDecode<Record<string, unknown>>(token);

        const rawRoles = decoded[APP_CONSTANTS.JWT_CLAIMS.ROLE];
        const roles: string[] =
            typeof rawRoles === "string" ? [rawRoles] :
                Array.isArray(rawRoles) ? (rawRoles as string[]) :
                    [];

        const id = String(decoded[APP_CONSTANTS.JWT_CLAIMS.ID] ?? "");

        if (!id) return null;

        const isPrivateRaw = String(decoded[APP_CONSTANTS.JWT_CLAIMS.IS_PRIVATE] ?? "false");
        const isPrivate = isPrivateRaw.toLowerCase() === "true";

        return {
            id,
            email: String(decoded[APP_CONSTANTS.JWT_CLAIMS.EMAIL] ?? ""),
            firstName: String(decoded[APP_CONSTANTS.JWT_CLAIMS.FIRST_NAME] ?? ""),
            lastName: String(decoded[APP_CONSTANTS.JWT_CLAIMS.LAST_NAME] ?? ""),
            image: String(decoded[APP_CONSTANTS.JWT_CLAIMS.IMAGE] ?? ""),
            username: String(decoded[APP_CONSTANTS.JWT_CLAIMS.USERNAME] ?? ""),
            phoneNumber: String(decoded[APP_CONSTANTS.JWT_CLAIMS.PHONE_NUMBER] ?? ""),
            bio: String(decoded[APP_CONSTANTS.JWT_CLAIMS.BIO] ?? ""),
            isPrivate,
            createdAt: String(decoded[APP_CONSTANTS.JWT_CLAIMS.CREATED_AT] ?? ""),
            updatedAt: String(decoded[APP_CONSTANTS.JWT_CLAIMS.UPDATED_AT] ?? ""),
            roles,
        };
    } catch {
        return null;
    }
};