import { api } from "@/services/api.ts";
import {serialize} from "object-to-formdata";

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

export const moodboardService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyMoodboards: builder.query<MoodboardPage, void>({
            query: () => "Boards/my",
            providesTags: ["MyMoodboards"],
        }),
        createMoodboard: builder.mutation<Moodboard, CreateMoodboardRequest>({
            query: (body) => ({
                url: "Boards/create",
                method: "POST",
                body: serialize(body, { indices: true, booleansAsIntegers: false }),
            }),
            invalidatesTags: ["MyMoodboards"],
        }),
    }),
});

export const { useGetMyMoodboardsQuery, useCreateMoodboardMutation } = moodboardService;