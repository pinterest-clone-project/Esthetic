import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAdminPinsFilters } from "@/hooks/useAdminPinsFilters.ts";
import { useSearchPinsQuery, useGetPinByIdQuery, useAdminRestorePinMutation } from "@/services/pinService.ts";
import PinsFilters from "@/components/admin/pins/PinsFilters.tsx";
import PinRow from "@/components/admin/pins/PinRow.tsx";
import PinFormModal from "@/components/admin/pins/PinFormModal.tsx";
import DeletePinModal from "@/components/admin/pins/DeletePinModal.tsx";
import type { IPinSummaryResponse } from "@/types/pin/responses/IPinSummaryResponse.ts";
import Pagination from "@/components/common/Pagination.tsx";
import { useTheme } from "@/context/ThemeContext.tsx";

const AdminPinsPage = () => {
    const { theme } = useTheme();
    const {
        search, setSearch, page, setPage, pageSize, handlePageSizeChange,
        sortBy, sortDirection, sortValue, handleSortChange,
        onlyDeletedByAdmin, setOnlyDeletedByAdmin,
    } = useAdminPinsFilters();

    const { data, isLoading, isFetching } = useSearchPinsQuery({
        search: search || undefined,
        sortBy,
        sortDirection,
        page,
        pageSize,
        onlyDeletedByAdmin,
    });

    const [editingPinId, setEditingPinId] = useState<string | null>(null);
    const [deletingPin, setDeletingPin] = useState<IPinSummaryResponse | null>(null);
    const { currentData: editingPin } = useGetPinByIdQuery(editingPinId!, { skip: !editingPinId });
    const [restorePin, { isLoading: isRestoring }] = useAdminRestorePinMutation();

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
                <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px] mb-1">Піни</h1>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
                    Пошук, пагінація та редагування пінів платформи
                </p>

                <PinsFilters
                    search={search}
                    onSearchChange={setSearch}
                    sortValue={sortValue}
                    onSortChange={handleSortChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />

                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60 mb-4 select-none cursor-pointer w-fit">
                    <input
                        type="checkbox"
                        checked={onlyDeletedByAdmin}
                        onChange={(e) => setOnlyDeletedByAdmin(e.target.checked)}
                        className="accent-btn-primary"
                    />
                    Показати видалені адміном
                </label>

                <div className="flex flex-col gap-2">
                    {isLoadingState
                        ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} height={74} borderRadius={16} />)
                        : data?.items.length === 0
                            ? <p className="text-sm text-gray-400 dark:text-white/40 text-center py-10">Пінів не знайдено</p>
                            : data?.items.map((pin) => (
                                <PinRow
                                    key={pin.id}
                                    pin={pin}
                                    onEdit={setEditingPinId}
                                    onDelete={setDeletingPin}
                                    isDeletedView={onlyDeletedByAdmin}
                                    onRestore={(id) => restorePin(id)}
                                    isRestoring={isRestoring}
                                />
                            ))}
                </div>

                {!isLoadingState && data && (
                    <Pagination page={data.page} totalPages={totalPages} totalCount={data.totalCount} onPageChange={setPage} />
                )}
            </div>

            {editingPinId && editingPin && (
                <PinFormModal key={editingPinId} pin={editingPin} onClose={() => setEditingPinId(null)} />
            )}
            {deletingPin && <DeletePinModal pin={deletingPin} onClose={() => setDeletingPin(null)} />}
        </SkeletonTheme>
    );
};

export default AdminPinsPage;