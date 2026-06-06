import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IAccount } from "@/types/account/IAccount.ts";

interface AuthState {
    user: IAccount | null;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
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
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setUser, clearUser,setLoading } = authSlice.actions;
export default authSlice.reducer;