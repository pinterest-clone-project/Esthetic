import { api } from "./api.ts";
import type { IPinSummaryResponse } from "../types/pin/responses/IPinSummaryResponse.ts";

export const recommendedPinsService = api.injectEndpoints({
    endpoints: (builder) => ({
        getRecommendedPins: builder.query<IPinSummaryResponse[], void>({
            query: () => ({ url: 'recommended/recommended', method: 'GET' }),
            providesTags: ['RecommendedPins', 'AllPins'],
        }),
        trackViewPin: builder.mutation<void, string>({
            query: (pinId) => ({
                url: `recommended/track-view/${pinId}`,
                method: 'POST',
            })
        })
    }),
});

export const {
    useGetRecommendedPinsQuery,
    useTrackViewPinMutation,
} = recommendedPinsService;