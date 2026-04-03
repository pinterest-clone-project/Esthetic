import APP_COMMON_CONSTANTS from "../constants/common";
import type {ITokenResponse} from "../types/account/responses/ITokenResponse.ts";

export const storage = {
    getAccessToken: () => localStorage.getItem(APP_COMMON_CONSTANTS.ACCESS_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(APP_COMMON_CONSTANTS.REFRESH_TOKEN_KEY),

    setAuth: (tokens: ITokenResponse) => {
        localStorage.setItem(APP_COMMON_CONSTANTS.ACCESS_TOKEN_KEY, tokens.accessToken);
        localStorage.setItem(APP_COMMON_CONSTANTS.REFRESH_TOKEN_KEY, tokens.refreshToken);
    },

    clearAuth: () => {
        localStorage.removeItem(APP_COMMON_CONSTANTS.ACCESS_TOKEN_KEY);
        localStorage.removeItem(APP_COMMON_CONSTANTS.REFRESH_TOKEN_KEY);
    }
};