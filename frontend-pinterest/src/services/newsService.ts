import { api } from "./api.ts";
import { serialize } from "object-to-formdata";
import type { INews } from "@/types/news/INews.ts";
import type { ICreateNewsRequest } from "@/types/news/requests/ICreateNewsRequest.ts";
import type { IUpdateNewsRequest } from "@/types/news/requests/IUpdateNewsRequest.ts";

export const newsService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllNews: builder.query<INews[], void>({
            query: () => ({ url: "News/getAll", method: "GET" }),
            providesTags: ["News"],
        }),
        createNews: builder.mutation<void, ICreateNewsRequest>({
            query: (data) => ({
                url: "News/create",
                method: "POST",
                body: serialize(data),
            }),
            invalidatesTags: ["News"],
        }),
        updateNews: builder.mutation<void, IUpdateNewsRequest>({
            query: ({ id, ...data }) => ({
                url: `News/update/${id}`,
                method: "PUT",
                body: serialize(data),
            }),
            invalidatesTags: ["News"],
        }),
        deleteNews: builder.mutation<void, string>({
            query: (id) => ({ url: `News/delete/${id}`, method: "DELETE" }),
            invalidatesTags: ["News"],
        }),
    }),
});

export const {
    useGetAllNewsQuery,
    useCreateNewsMutation,
    useUpdateNewsMutation,
    useDeleteNewsMutation,
} = newsService;
