import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ReportStatus } from "@/types/report/ReportStatus.ts";
import type { ReportSortBy } from "@/types/report/ReportSortBy.ts";
import type { SortDirection } from "@/types/SortDirection.ts";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/common";

export type ReportStatusFilter = "all" | ReportStatus;

const STATUS_NAME_TO_ENUM: Record<string, ReportStatus> = {
    Pending: ReportStatus.Pending,
    Reviewed: ReportStatus.Reviewed,
    Resolved: ReportStatus.Resolved,
    Dismissed: ReportStatus.Dismissed,
};

const STATUS_ENUM_TO_NAME: Record<ReportStatus, string> = {
    [ReportStatus.Pending]: "Pending",
    [ReportStatus.Reviewed]: "Reviewed",
    [ReportStatus.Resolved]: "Resolved",
    [ReportStatus.Dismissed]: "Dismissed",
};

const parseStatus = (raw: string | null): ReportStatusFilter => {
    if (raw && raw in STATUS_NAME_TO_ENUM) return STATUS_NAME_TO_ENUM[raw];
    return "all";
};

export const useAdminReportsFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [status, setStatusState] = useState<ReportStatusFilter>(
        parseStatus(searchParams.get("status"))
    );

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

    const pageSize = (() => {
        const raw = parseInt(searchParams.get("pageSize") ?? "", 10);
        return (PAGE_SIZE_OPTIONS as readonly number[]).includes(raw) ? raw : DEFAULT_PAGE_SIZE;
    })();

    const sortBy = (searchParams.get("sortBy") as ReportSortBy) ?? "CreatedAt";
    const sortDirection = (searchParams.get("sortDirection") as SortDirection) ?? "Desc";
    const sortValue = `${sortBy}:${sortDirection}` as `${ReportSortBy}:${SortDirection}`;

    const updateParams = (updates: Record<string, string | null>) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            Object.entries(updates).forEach(([key, value]) => {
                if (value === null) next.delete(key);
                else next.set(key, value);
            });
            return next;
        });
    };

    const setPage = (newPage: number) => updateParams({ page: String(newPage) });

    const handlePageSizeChange = (newSize: number) =>
        updateParams({ pageSize: String(newSize), page: "1" });

    const handleSortChange = (value: string) => {
        const [newSortBy, newSortDirection] = value.split(":");
        updateParams({ sortBy: newSortBy, sortDirection: newSortDirection, page: "1" });
    };

    const setStatus = (value: ReportStatusFilter) => {
        setStatusState(value);
        updateParams({
            status: value !== "all" ? STATUS_ENUM_TO_NAME[value] : null,
            page: "1",
        });
    };

    const statusParam = status !== "all" ? status : undefined;

    return {
        status,
        setStatus,
        page,
        setPage,
        pageSize,
        handlePageSizeChange,
        sortBy,
        sortDirection,
        sortValue,
        handleSortChange,
        statusParam,
    };
};