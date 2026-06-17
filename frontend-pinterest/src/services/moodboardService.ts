import { api } from "@/services/api.ts";
import {serialize} from "object-to-formdata";

export interface Moodboard {
    id: string;
    title: string;
    description?: string;
    isPrivate: boolean;
    coverUrls: string[];
}

export interface CreateMoodboardRequest {
    title: string;
    description?: string;
    isPrivate: boolean;
    coverImageFile?: File;
}

export const moodboardService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyMoodboards: builder.query<Moodboard[], void>({
            query: () => "/api/Boards/my",
            providesTags: ["MyMoodboards"],
        }),
        createMoodboard: builder.mutation<Moodboard, CreateMoodboardRequest>({
            query: (body) => ({
                url: "/api/Boards/create",
                method: "POST",
                body: serialize(body, { indices: true, booleansAsIntegers: false }),
            }),
            invalidatesTags: ["MyMoodboards"],
        }),
    }),
});

export const { useGetMyMoodboardsQuery, useCreateMoodboardMutation } = moodboardService;