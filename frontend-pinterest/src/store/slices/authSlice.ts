import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAccount } from "@/types/account/IAccount.ts";

interface AuthState {
    user: IAccount | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: true,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IAccount>) => {
            state.user = action.payload;
            state.isLoading = false;
        },
        clearUser: (state) => {
            state.user = null;
            state.isLoading = false;
        }
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;