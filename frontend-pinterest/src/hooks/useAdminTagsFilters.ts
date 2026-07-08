import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { TagSortBy } from "@/types/tag/TagSortBy.ts";
import type { SortDirection } from "@/types/SortDirection.ts";
import { DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from "@/constants/common";

export const useAdminTagsFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearchState] = useState(searchParams.get("search") ?? "");

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

    const pageSize = (() => {
        const raw = parseInt(searchParams.get("pageSize") ?? "", 10);
        return (PAGE_SIZE_OPTIONS as readonly number[]).includes(raw) ? raw : DEFAULT_PAGE_SIZE;
    })();

    const sortBy = (searchParams.get("sortBy") as TagSortBy) ?? "CreatedAt";
    const sortDirection = (searchParams.get("sortDirection") as SortDirection) ?? "Desc";
    const sortValue = `${sortBy}:${sortDirection}` as `${TagSortBy}:${SortDirection}`;

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

    const setSearch = (value: string) => {
        setSearchState(value);
        updateParams({ search: value || null, page: "1" });
    };

    const setPage = (newPage: number) => updateParams({ page: String(newPage) });

    const handlePageSizeChange = (newSize: number) =>
        updateParams({ pageSize: String(newSize), page: "1" });

    const handleSortChange = (value: string) => {
        const [newSortBy, newSortDirection] = value.split(":");
        updateParams({ sortBy: newSortBy, sortDirection: newSortDirection, page: "1" });
    };

    return {
        search,
        setSearch,
        page,
        setPage,
        pageSize,
        handlePageSizeChange,
        sortBy,
        sortDirection,
        sortValue,
        handleSortChange,
    };
};