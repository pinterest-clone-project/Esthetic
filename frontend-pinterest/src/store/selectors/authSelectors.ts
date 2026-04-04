import type { RootState } from "../index";

export const selectUser      = (state: RootState) => state.auth.user;
export const selectIsAuth    = (state: RootState) => !!state.auth.user;
export const selectUserRoles = (state: RootState) => state.auth.user?.roles ?? [];
export const selectIsAdmin   = (state: RootState) =>
    state.auth.user?.roles.includes("Admin") ?? false;