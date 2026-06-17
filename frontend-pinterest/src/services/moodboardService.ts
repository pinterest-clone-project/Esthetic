import { api } from "@/services/api.ts";

export interface Moodboard {
    id: string;
    name: string;
    isHidden: boolean;
    coverUrls: string[];
}

export interface CreateMoodboardRequest {
    name: string;
    isHidden: boolean;
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
                body,
            }),
            invalidatesTags: ["MyMoodboards"],
        }),
    }),
});

export const { useGetMyMoodboardsQuery, useCreateMoodboardMutation } = moodboardService;