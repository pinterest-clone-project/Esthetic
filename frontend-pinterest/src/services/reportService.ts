import { api } from "./api.ts";
import type { ICreateReportRequest } from "@/types/report/requests/ICreateReportRequest.ts";
import type { IReportResponse } from "@/types/report/responses/IReportResponse.ts";

export const reportService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyReports: builder.query<IReportResponse[], void>({
            query: () => ({ url: "Reports/my", method: "GET" }),
            providesTags: ["MyReports"],
        }),
        getAllReports: builder.query<IReportResponse[], void>({
            query: () => ({ url: "Reports/getAll", method: "GET" }),
            providesTags: ["AllReports"],
        }),
        createReport: builder.mutation<IReportResponse, ICreateReportRequest>({
            query: (data) => ({
                url: "Reports/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["MyReports", "AllReports"],
        }),
    }),
});

export const {
    useGetMyReportsQuery,
    useGetAllReportsQuery,
    useCreateReportMutation,
} = reportService;