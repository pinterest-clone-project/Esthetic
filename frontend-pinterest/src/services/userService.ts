import {api} from "@/services/api.ts";
import type {IPagedResult} from "@/types/IPagedResult.ts";
import type {IUser} from "@/types/user/IUser.ts";
import type {ISearchUsersParams} from "@/types/user/ISearchUsersParams.ts";

export const userService = api.injectEndpoints({
    endpoints: (builder) => ({
        searchUsers: builder.query<IPagedResult<IUser>, ISearchUsersParams>({
            query: ({ search, page = 1, pageSize = 10 }) => ({
                url: "Users/search",
                params: { search, page, pageSize },
            }),
        }),
    })
});

export const { useSearchUsersQuery } = userService;