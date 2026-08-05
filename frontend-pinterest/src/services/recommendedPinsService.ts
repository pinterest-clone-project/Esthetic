import { api } from "./api.ts";
import type { IPinSummaryResponse } from "../types/pin/responses/IPinSummaryResponse.ts";
import type {IPagedResult} from "@/types/IPagedResult.ts";

export const recommendedPinsService = api.injectEndpoints({
    endpoints: (builder) => ({
        getRecommendedPins: builder.query<IPagedResult<IPinSummaryResponse>, { page: number; seed: number; pageSize?: number }>({
            query: ({ page, seed, pageSize = 20 }) => ({
                url: 'recommended/recommended',
                method: 'GET',
                params: { page, pageSize, seed },
            }),
            providesTags: ['RecommendedPins', 'AllPins'],
        }),
        trackViewPin: builder.mutation<void, string>({
            query: (pinId) => ({
                url: `recommended/track-view/${pinId}`,
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetRecommendedPinsQuery,
    useTrackViewPinMutation,
} = recommendedPinsService;