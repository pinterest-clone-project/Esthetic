import { api } from "./api.ts";
import type { ITagResponse } from "@/types/tag/ITagResponse.ts";

export const tagService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllTags: builder.query<ITagResponse[], void>({
            query: () => ({
                url: 'Tags/getAll',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetAllTagsQuery } = tagService;
