import { api } from "@/services/api.ts";
import {serialize} from "object-to-formdata";
import type { IPagedResult } from "@/types/IPagedResult.ts";
import type { ISearchBoardsParams } from "@/types/board/requests/ISearchBoardsParams.ts";

export interface Moodboard {
    id: string;
    title: string;
    description?: string;
    isPrivate: boolean;
    coverImageUrl: string | null;
}

export interface CreateMoodboardRequest {
    title: string;
    description?: string;
    isPrivate: boolean;
    coverImageFile?: File;
}

export interface MoodboardPage {
    items: Moodboard[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface MoodboardDetail {
    id: string;
    title: string;
    description?: string;
    coverImageUrl: string | null;
    isPrivate: boolean;
    isArchived: boolean;
    ownerId: string;
    createdAt: string;
    updatedAt: string | null;
    pinsCount: number;
    previewImageUrls: string[];
}

export interface MoodboardAdmin {
    id: string;
    title: string;
    description?: string;
    coverImageUrl: string | null;
    isPrivate: boolean;
    isArchived: boolean;
    ownerId: string;
    createdAt: string;
    updatedAt: string | null;
    pinsCount: number;
}

export interface UpdateMoodboardRequest {
    id: string;
    title?: string;
    description?: string;
    isPrivate?: boolean;
    coverImageFile?: File;
}

export const moodboardService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyMoodboards: builder.query<MoodboardPage, void>({
            query: () => "Boards/my",
            providesTags: ["MyMoodboards"],
        }),
        searchMoodboards: builder.query<IPagedResult<MoodboardAdmin>, ISearchBoardsParams>({
            query: (params) => ({ url: "Boards/search", method: "GET", params }),
            providesTags: ["AllMoodboards"],
        }),
        createMoodboard: builder.mutation<Moodboard, CreateMoodboardRequest>({
            query: (body) => ({
                url: "Boards/create",
                method: "POST",
                body: serialize(body, { indices: true, booleansAsIntegers: false }),
            }),
            invalidatesTags: ["MyMoodboards"],
        }),
        getMoodboardById: builder.query<MoodboardDetail, string>({
            query: (id) => `Boards/getById/${id}`,
            providesTags: ["MyMoodboards", "AllMoodboards"],
        }),
        updateMoodboard: builder.mutation<MoodboardAdmin, UpdateMoodboardRequest>({
            query: ({ id, ...body }) => ({
                url: `Boards/update/${id}`,
                method: "PUT",
                body: serialize(body, { indices: true, booleansAsIntegers: false }),
            }),
            invalidatesTags: ["MyMoodboards", "AllMoodboards"],
        }),
    }),
});

export const {
    useGetMyMoodboardsQuery,
    useCreateMoodboardMutation,
    useGetMoodboardByIdQuery,
    useSearchMoodboardsQuery,
    useUpdateMoodboardMutation,
} = moodboardService;
