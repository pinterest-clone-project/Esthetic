import type { ITagResponse } from "@/types/tag/ITagReponse.ts";
import { api } from "./api.ts";


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
