import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {IAccount} from "@/types/account/IAccount.ts";
import {parseToken} from "@/utils/parseToken.ts";
import {storage} from "@/utils/storage.ts";
import type {ITokenResponse} from "@/types/account/responses/ITokenResponse.ts";


interface AuthState {
    user: IAccount | null;
}

const initialState: AuthState = {
    user: parseToken(storage.getAccessToken() ?? ""),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStorage: (state, action: PayloadAction<ITokenResponse>) => {
            const { accessToken, refreshToken } = action.payload;
            const user = parseToken(accessToken);

            if (user) {
                state.user = user;
                storage.setAuth({ accessToken, refreshToken });
            }
        },
        logoutStorage: (state) => {
            state.user = null;
            storage.clearAuth();
        },
    },
});

export const { loginStorage, logoutStorage } = authSlice.actions;
export default authSlice.reducer;