import { api } from "./api.ts";
import type { IPinResponse } from "../types/pin/responses/IPinResponse.ts";
import type { IPinSummaryResponse } from "../types/pin/responses/IPinSummaryResponse.ts";
import type { ICreatePinRequest } from "../types/pin/requests/ICreatePinRequest.ts";
import type { IUpdatePinRequest } from "../types/pin/requests/IUpdatePinRequest.ts";
import { serialize } from "object-to-formdata";

export const pinService = api.injectEndpoints({
    endpoints: (builder) => ({
        getAllPins: builder.query<IPinSummaryResponse[], void>({
            query: () => ({
                url: 'Pins/getAll',
                method: 'GET',
            }),
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
        }),
        updatePin: builder.mutation<void, IUpdatePinRequest>({
            query: ({ id, ...data }) => ({
                url: `Pins/update/${id}`,
                method: 'PUT',
                body: serialize(data),
            }),
        }),
        deletePin: builder.mutation<void, string>({
            query: (id) => ({
                url: `Pins/delete/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useGetAllPinsQuery,
    useGetPinByIdQuery,
    useCreatePinMutation,
    useUpdatePinMutation,
    useDeletePinMutation,
} = pinService;
