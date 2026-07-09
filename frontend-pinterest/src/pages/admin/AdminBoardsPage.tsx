import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAdminBoardsFilters } from "@/hooks/useAdminBoardsFilters.ts";
import { useSearchMoodboardsQuery, type MoodboardAdmin } from "@/services/moodboardService.ts";
import BoardsFilters from "@/components/admin/boards/BoardsFilters.tsx";
import BoardRow from "@/components/admin/boards/BoardRow.tsx";
import BoardFormModal from "@/components/admin/boards/BoardFormModal.tsx";
import Pagination from "@/components/common/Pagination.tsx";

const AdminBoardsPage = () => {
    const {
        search, setSearch, page, setPage, pageSize, handlePageSizeChange,
        sortBy, sortDirection, sortValue, handleSortChange,
    } = useAdminBoardsFilters();

    const { data, isLoading, isFetching } = useSearchMoodboardsQuery({
        search: search || undefined,
        sortBy,
        sortDirection,
        page,
        pageSize,
        includeArchived: true,
    });

    const [editingBoard, setEditingBoard] = useState<MoodboardAdmin | null>(null);
    const isLoadingState = isLoading || (isFetching && !data);
    const totalPages = data?.totalPages ?? 1;

    useEffect(() => {
        if (data && totalPages > 0 && page > totalPages) setPage(totalPages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, totalPages]);

    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#333333">
            <div className="relative z-10 w-full max-w-full overflow-x-hidden">
                <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px] mb-1">Дошки</h1>
                <p className="text-xs sm:text-sm text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
                    Пошук, пагінація та редагування дошок користувачів
                </p>

                <BoardsFilters
                    search={search}
                    onSearchChange={setSearch}
                    sortValue={sortValue}
                    onSortChange={handleSortChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />

                <div className="flex flex-col gap-2">
                    {isLoadingState
                        ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} height={74} borderRadius={16} />)
                        : data?.items.length === 0
                            ? <p className="text-sm text-white/40 text-center py-10">Дошок не знайдено</p>
                            : data?.items.map((board) => (
                                <BoardRow key={board.id} board={board} onEdit={setEditingBoard} />
                            ))}
                </div>

                {!isLoadingState && data && (
                    <Pagination page={data.page} totalPages={totalPages} totalCount={data.totalCount} onPageChange={setPage} />
                )}
            </div>

            {editingBoard && (
                <BoardFormModal board={editingBoard} onClose={() => setEditingBoard(null)} />
            )}
        </SkeletonTheme>
    );
};

export default AdminBoardsPage;
