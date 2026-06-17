import { api } from "./api.ts";
import type {ICategory} from "@/types/categories/ICategory.ts";
import {serialize} from "object-to-formdata";

export const categoryService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllCategories: builder.query<ICategory[], void>({
            query: () => ({
                url: 'Categories/getAll',
                method: 'GET',
            }),
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
        }),
        updateCategory: builder.mutation<void, ICategory>({
            query: ({ id, ...data }) => ({
                url: `Categories/update/${id}`,
                method: 'PUT',
                body: serialize(data),
            }),
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `Categories/delete/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllCategoriesQuery,
    useGetCategoryByIdQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryService;

