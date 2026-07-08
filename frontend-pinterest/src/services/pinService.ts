import { api } from "./api.ts";
import type { IPinSummaryResponse } from "../types/pin/responses/IPinSummaryResponse.ts";
import type { ICreatePinRequest } from "../types/pin/requests/ICreatePinRequest.ts";
import { serialize } from "object-to-formdata";
import type {IUpdatePinRequest} from "@/types/pin/requests/IUpdatePinResponse.ts";
import type {IPinResponse} from "@/types/pin/responses/IPinResponses.ts";

export const pinService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPins: builder.query<IPinSummaryResponse[], void>({
            query: () => ({ url: 'Pins/getAll', method: 'GET' }),
            providesTags: ['AllPins'],
        }),
        getPinById: builder.query<IPinResponse, string>({
            query: (id) => ({
                url: `Pins/getById/${id}`,
                method: 'GET',
            }),
            providesTags: ["AllPins"],
        }),
        createPin: builder.mutation<IPinResponse, ICreatePinRequest>({
            query: (data) => ({
                url: 'Pins/create',
                method: 'POST',
                body: serialize(data),
            }),
            invalidatesTags: ['MyPins', 'AllPins'],
        }),
        updatePin: builder.mutation<void, IUpdatePinRequest>({
            query: ({ id, ...data }) => ({
                url: `Pins/update/${id}`,
                method: 'PUT',
                body: serialize(data),
            }),
            invalidatesTags: ['MyPins', 'AllPins'],
        }),
        deletePin: builder.mutation<void, string>({
            query: (id) => ({
                url: `Pins/delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['MyPins', 'AllPins'],
        }),
        getMyPins: builder.query<IPinSummaryResponse[], void>({
            query: () => ({
                url: 'Pins/my',
                method: 'GET',
            }),
            providesTags: ['MyPins'],
        }),
        savePin: builder.mutation<void, { pinId: string; boardId: string; }>({
            query: (body) => ({
                url: `Pins/${body.pinId}/save`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['MyMoodboards'],
        }),
        unsavePin: builder.mutation<void, { pinId: string; boardId: string }>({
            query: (body) => ({
                url: `Pins/${body.pinId}/unsave`,
                method: 'DELETE',
                body,
            }),
            invalidatesTags: ['MyMoodboards'],
        }),
        getSavedBoards: builder.query<string[], string>({
            query: (pinId) => `Pins/${pinId}/saved-boards`,
            providesTags: ['MyMoodboards'],
        }),
    }),
});

export const {
    useGetAllPinsQuery,
    useGetPinByIdQuery,
    useCreatePinMutation,
    useUpdatePinMutation,
    useDeletePinMutation,
    useGetMyPinsQuery,
    useGetSavedBoardsQuery,
    useSavePinMutation,
    useUnsavePinMutation,
} = pinService;
