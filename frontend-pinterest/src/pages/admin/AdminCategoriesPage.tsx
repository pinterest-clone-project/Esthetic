import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAdminCategoriesFilters } from "@/hooks/useAdminCategoriesFilters.ts";
import CategoriesFilters from "@/components/admin/categories/CategoriesFilters.tsx";
import CategoryRow from "@/components/admin/categories/CategoryRow.tsx";
import CategoryFormModal from "@/components/admin/categories/CategoryFormModal.tsx";
import DeleteCategoryModal from "@/components/admin/categories/DeleteCategoryModal.tsx";
import Pagination from "@/components/common/Pagination.tsx";
import {useSearchCategoriesQuery} from "@/services/categoryService.ts";
import type {ICategory} from "@/types/categories/ICategory.ts";

const AdminCategoriesPage = () => {
    const {
        search, setSearch, page, setPage, pageSize, handlePageSizeChange,
        sortBy, sortDirection, sortValue, handleSortChange,
    } = useAdminCategoriesFilters();

    const { data, isLoading, isFetching } = useSearchCategoriesQuery({
        search: search || undefined, sortBy, sortDirection, page, pageSize,
    });

    const [editingCategory, setEditingCategory] = useState<ICategory | null | "new">(null);
    const [deletingCategory, setDeletingCategory] = useState<ICategory | null>(null);

    const isLoadingState = isLoading || (isFetching && !data);
    const totalPages = data?.totalPages ?? 1;

    useEffect(() => {
        if (data && totalPages > 0 && page > totalPages) setPage(totalPages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, totalPages]);

    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#333333">
            <div className="relative z-10 w-full max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px]">Категорії</h1>
                    <button
                        onClick={() => setEditingCategory("new")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-btn-primary text-white text-sm hover:opacity-90 transition-opacity"
                    >
                        <Plus size={16} />
                        Нова категорія
                    </button>
                </div>
                <p className="text-xs sm:text-sm text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
                    Керування категоріями платформи
                </p>

                <CategoriesFilters
                    search={search}
                    onSearchChange={setSearch}
                    sortValue={sortValue}
                    onSortChange={handleSortChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />

                <div className="flex flex-col gap-2">
                    {isLoadingState
                        ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} height={68} borderRadius={16} />)
                        : data?.items.length === 0
                            ? <p className="text-sm text-white/40 text-center py-10">Категорій не знайдено</p>
                            : data?.items.map((category) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    onEdit={setEditingCategory}
                                    onDelete={setDeletingCategory}
                                />
                            ))}
                </div>

                {!isLoadingState && data && (
                    <Pagination page={data.page} totalPages={totalPages} totalCount={data.totalCount} onPageChange={setPage} />
                )}
            </div>

            {editingCategory && (
                <CategoryFormModal
                    category={editingCategory === "new" ? null : editingCategory}
                    onClose={() => setEditingCategory(null)}
                />
            )}

            {deletingCategory && (
                <DeleteCategoryModal category={deletingCategory} onClose={() => setDeletingCategory(null)} />
            )}
        </SkeletonTheme>
    );
};

export default AdminCategoriesPage;