import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAccount } from "@/types/account/IAccount.ts";

interface AuthState {
    user: IAccount | null;
}

const initialState: AuthState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IAccount>) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;