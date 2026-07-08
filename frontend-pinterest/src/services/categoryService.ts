import { api } from "./api.ts";
import type {ICategory} from "@/types/categories/ICategory.ts";
import {serialize} from "object-to-formdata";
import type {IPagedResult} from "@/types/IPagedResult.ts";
import type {ISearchCategoriesParams} from "@/types/categories/requests/ISearchCategoriesParams.ts";

export const categoryService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<ICategory[], void>({
            query: () => ({
                url: 'Categories/getAll',
                method: 'GET',
            }),
            providesTags: ["AllCategories"],
        }),
        searchCategories: builder.query<IPagedResult<ICategory>, ISearchCategoriesParams>({
            query: (params) => ({ url: "Categories/search", method: "GET", params }),
            providesTags: ["AllCategories"],
        }),
        getCategoryById: builder.query<ICategory, string>({
            query: (id) => ({
                url: `Categories/getById/${id}`,
                method: 'GET',
            }),
        }),
        createCategory: builder.mutation<ICategory, ICategory>({
            query: (data) => ({
                url: 'Categories/create',
                method: 'POST',
                body: serialize(data),
            }),
            invalidatesTags: ["AllCategories"],
        }),
        updateCategory: builder.mutation<void, ICategory>({
            query: ({ id, ...data }) => ({
                url: `Categories/update/${id}`,
                method: 'PUT',
                body: serialize(data),
            }),
            invalidatesTags: ["AllCategories"],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `Categories/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["AllCategories"],
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
    useSearchCategoriesQuery
} = categoryService;

