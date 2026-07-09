import type { IPagedResult } from "@/types/IPagedResult.ts";
import { api } from "./api.ts";
import type { ICreateReportRequest } from "@/types/report/requests/ICreateReportRequest.ts";
import type { IReportResponse } from "@/types/report/responses/IReportResponse.ts";
import type { IPinReportGroup } from "@/types/report/responses/IPinReportGroup.ts";
import { ReportStatus } from "@/types/report/ReportStatus.ts"; // ⬅️ важливо: value-import, не `import type`
import type { IGetAllReportsParams } from "@/types/report/requests/IGetAllReportsParams.ts";

const normalizeReportStatus = (raw: unknown): ReportStatus => {
    if (typeof raw === "string" && raw in ReportStatus) {
        return ReportStatus[raw as keyof typeof ReportStatus];
    }
    if (typeof raw === "number") {
        return raw as ReportStatus;
    }
    console.warn("Невідомий статус репорту з бекенду:", raw);
    return ReportStatus.Pending;
};

export const reportService = api.injectEndpoints({
    endpoints: (builder) => ({
        getMyReports: builder.query<IReportResponse[], void>({
            query: () => ({ url: "Reports/my", method: "GET" }),
            providesTags: ["MyReports"],
        }),
        getAllReports: builder.query<IPagedResult<IPinReportGroup>, IGetAllReportsParams>({
            query: (params) => ({ url: "Reports/getAll", params }),
            transformResponse: (response: IPagedResult<IPinReportGroup>) => ({
                ...response,
                items: response.items.map((group) => ({
                    ...group,
                    reports: group.reports.map((r) => ({
                        ...r,
                        status: normalizeReportStatus(r.status),
                    })),
                })),
            }),
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
        updateReportStatus: builder.mutation<void, { id: string; status: ReportStatus }>({
            query: ({ id, status }) => ({
                url: `Reports/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["AllReports"],
        }),
    }),
});

export const {
    useGetMyReportsQuery,
    useGetAllReportsQuery,
    useCreateReportMutation,
    useUpdateReportStatusMutation,
} = reportService;