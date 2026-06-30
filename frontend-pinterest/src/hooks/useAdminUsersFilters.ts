import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { UserSortBy } from "@/types/user/UserSortBy.ts";
import type { SortDirection } from "@/types/SortDirection.ts";
import {DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, type StatusFilter} from "@/constants/common";

export const useAdminUsersFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("search") ?? "");
    const [status, setStatus] = useState<StatusFilter>(
        (searchParams.get("status") as StatusFilter) ?? "all"
    );

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

    const pageSize = (() => {
        const raw = parseInt(searchParams.get("pageSize") ?? "", 10);
        return (PAGE_SIZE_OPTIONS as readonly number[]).includes(raw) ? raw : DEFAULT_PAGE_SIZE;
    })();

    const sortBy = (searchParams.get("sortBy") as UserSortBy) ?? "CreatedAt";
    const sortDirection = (searchParams.get("sortDirection") as SortDirection) ?? "Desc";
    const sortValue = `${sortBy}:${sortDirection}` as `${UserSortBy}:${SortDirection}`;

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

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timeout);
    }, [search]);

    const isFirstRun = useRef(true);
    useEffect(() => {
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }
        updateParams({
            search: debouncedSearch || null,
            status: status !== "all" ? status : null,
            page: "1",
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, status]);

    const isBlockedParam = useMemo<boolean | undefined>(() => {
        if (status === "active") return false;
        if (status === "blocked") return true;
        return undefined;
    }, [status]);

    return {
        search,
        setSearch,
        debouncedSearch,
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
        isBlockedParam,
    };
};