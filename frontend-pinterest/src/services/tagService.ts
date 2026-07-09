import type { ITagResponse } from "@/types/tag/responses/ITagReponse.ts";
import type { IPagedResult } from "@/types/IPagedResult.ts";
import type { ISearchTagsParams } from "@/types/tag/requests/ISearchTagsParams.ts";
import type { IUpdateTag } from "@/types/tag/requests/IUpdateTag.ts";
import { api } from "./api.ts";

export const tagService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllTags: builder.query<ITagResponse[], void>({
            query: () => ({ url: "Tags/getAll", method: "GET" }),
            providesTags: ["AllTags"],
        }),

        searchTags: builder.query<IPagedResult<ITagResponse>, ISearchTagsParams>({
            query: (params) => ({ url: "Tags/search", method: "GET", params }),
            providesTags: ["AllTags"],
        }),

        createTag: builder.mutation<ITagResponse, FormData>({
            query: (formData) => ({
                url: "Tags/create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["AllTags"],
        }),

        updateTag: builder.mutation<void, IUpdateTag>({
            query: ({ id, ...body }) => ({
                url: `Tags/update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["AllTags"],
        }),

        deleteTag: builder.mutation<void, string>({
            query: (id) => ({
                url: `Tags/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["AllTags"],
        }),
    }),
});

export const {
    useGetAllTagsQuery,
    useSearchTagsQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} = tagService;