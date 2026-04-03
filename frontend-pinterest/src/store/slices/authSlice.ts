import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ITokenResponse } from "../../types/account/responses/ITokenResponse";
import type {IAccount} from "../../types/account/IAccount.ts";
import {parseToken} from "../../utils/parseToken.ts";
import {storage} from "../../utils/storage.ts";

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
        login: (state, action: PayloadAction<ITokenResponse>) => {
            const { accessToken, refreshToken } = action.payload;
            const user = parseToken(accessToken);

            if (user) {
                state.user = user;
                storage.setAuth({ accessToken, refreshToken });
            }
        },
        logout: (state) => {
            state.user = null;
            storage.clearAuth();
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;