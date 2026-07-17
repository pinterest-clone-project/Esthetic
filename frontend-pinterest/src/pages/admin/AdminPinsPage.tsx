import { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAdminPinsFilters } from "@/hooks/useAdminPinsFilters.ts";
import { useSearchPinsQuery, useGetPinByIdQuery } from "@/services/pinService.ts";
import PinsFilters from "@/components/admin/pins/PinsFilters.tsx";
import PinRow from "@/components/admin/pins/PinRow.tsx";
import PinFormModal from "@/components/admin/pins/PinFormModal.tsx";
import Pagination from "@/components/common/Pagination.tsx";

const AdminPinsPage = () => {
    const {
        search, setSearch, page, setPage, pageSize, handlePageSizeChange,
        sortBy, sortDirection, sortValue, handleSortChange,
    } = useAdminPinsFilters();

    const { data, isLoading, isFetching } = useSearchPinsQuery({
        search: search || undefined,
        sortBy,
        sortDirection,
        page,
        pageSize,
    });

    const [editingPinId, setEditingPinId] = useState<string | null>(null);
    const { currentData: editingPin } = useGetPinByIdQuery(editingPinId!, { skip: !editingPinId });

    const isLoadingState = isLoading || (isFetching && !data);
    const totalPages = data?.totalPages ?? 1;

    useEffect(() => {
        if (data && totalPages > 0 && page > totalPages) setPage(totalPages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, totalPages]);

    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#333333">
            <div className="relative z-10 w-full max-w-full overflow-x-hidden">
                <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px] mb-1">Піни</h1>
                <p className="text-xs sm:text-sm text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
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

                <div className="flex flex-col gap-2">
                    {isLoadingState
                        ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} height={74} borderRadius={16} />)
                        : data?.items.length === 0
                            ? <p className="text-sm text-white/40 text-center py-10">Пінів не знайдено</p>
                            : data?.items.map((pin) => (
                                <PinRow key={pin.id} pin={pin} onEdit={setEditingPinId} />
                            ))}
                </div>

                {!isLoadingState && data && (
                    <Pagination page={data.page} totalPages={totalPages} totalCount={data.totalCount} onPageChange={setPage} />
                )}
            </div>

            {editingPinId && editingPin && (
                <PinFormModal key={editingPinId} pin={editingPin} onClose={() => setEditingPinId(null)} />
            )}
        </SkeletonTheme>
    );
};

export default AdminPinsPage;
