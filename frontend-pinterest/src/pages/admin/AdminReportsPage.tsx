import { useEffect } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useGetAllReportsQuery } from "@/services/reportService.ts";
import { useAdminReportsFilters } from "@/hooks/useAdminReportsFilters.ts";
import ReportsFilters from "@/components/admin/reports/ReportsFilters.tsx";
import PinReportGroupCard from "@/components/admin/reports/PinReportGroupCard.tsx";
import Pagination from "@/components/common/Pagination.tsx";
import { useTheme } from "@/context/ThemeContext.tsx";

const AdminReportsPage = () => {
    const { theme } = useTheme();
    const {
        status, setStatus, page, setPage, pageSize, handlePageSizeChange,
        sortBy, sortDirection, sortValue, handleSortChange, statusParam,
    } = useAdminReportsFilters();

    const { data, isLoading, isFetching } = useGetAllReportsQuery({
        status: statusParam, sortBy, sortDirection, page, pageSize,
    });

    const isLoadingState = isLoading || (isFetching && !data);
    const totalPages = data?.totalPages ?? 1;

    useEffect(() => {
        if (data && totalPages > 0 && page > totalPages) setPage(totalPages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, totalPages]);

    return (
        <SkeletonTheme 
            baseColor={theme === "dark" ? "#202020" : "#e5e7eb"} 
            highlightColor={theme === "dark" ? "#333333" : "#f3f4f6"}
        >
            <div className="relative z-10 w-full max-w-full overflow-x-hidden">
                <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px] mb-1">Скарги</h1>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
                    Скарги на піни, згруповані по об'єкту
                </p>

                <ReportsFilters
                    status={status}
                    onStatusChange={setStatus}
                    sortValue={sortValue}
                    onSortChange={handleSortChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />

                <div className="flex flex-col gap-3">
                    {isLoadingState
                        ? Array.from({ length: 4 }).map((_, idx) => <Skeleton key={idx} height={72} borderRadius={16} />)
                        : data?.items.length === 0
                            ? <p className="text-sm text-gray-400 dark:text-white/40 text-center py-10">Скарг не знайдено</p>
                            : data?.items.map((group) => <PinReportGroupCard key={group.pinId} group={group} />)}
                </div>

                {!isLoadingState && data && (
                    <Pagination page={data.page} totalPages={totalPages} totalCount={data.totalCount} onPageChange={setPage} />
                )}
            </div>
        </SkeletonTheme>
    );
};

export default AdminReportsPage;