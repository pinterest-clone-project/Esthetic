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
        }),
        createPin: builder.mutation<IPinResponse, ICreatePinRequest>({
            query: (data) => ({
                url: 'Pins/create',
                method: 'POST',
                body: serialize(data),
            }),
            invalidatesTags: ['MyPins'],
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
        }),
        getMyPins: builder.query<IPinSummaryResponse[], void>({
            query: () => ({
                url: 'Pins/my',
                method: 'GET',
            }),
            providesTags: ['MyPins'],
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
} = pinService;
