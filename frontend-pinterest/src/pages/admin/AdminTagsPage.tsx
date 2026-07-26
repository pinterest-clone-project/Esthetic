import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useSearchTagsQuery } from "@/services/tagService.ts";
import { useAdminTagsFilters } from "@/hooks/useAdminTagsFilters.ts";
import TagsFilters from "@/components/admin/tags/TagsFilters.tsx";
import TagRow from "@/components/admin/tags/TagRow.tsx";
import TagFormModal from "@/components/admin/tags/TagFormModal.tsx";
import DeleteTagModal from "@/components/admin/tags/DeleteTagModal.tsx";
import Pagination from "@/components/common/Pagination.tsx";
import type {ITagResponse} from "@/types/tag/responses/ITagReponse.ts";
import { useTheme } from "@/context/ThemeContext.tsx";

const AdminTagsPage = () => {
    const { theme } = useTheme();
    const {
        search, setSearch, page, setPage, pageSize, handlePageSizeChange,
        sortBy, sortDirection, sortValue, handleSortChange,
    } = useAdminTagsFilters();

    const { data, isLoading, isFetching } = useSearchTagsQuery({
        search: search || undefined, sortBy, sortDirection, page, pageSize,
    });

    const [editingTag, setEditingTag] = useState<ITagResponse | null | "new">(null);
    const [deletingTag, setDeletingTag] = useState<ITagResponse | null>(null);

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
                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px]">Теги</h1>
                    <button
                        onClick={() => setEditingTag("new")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-btn-primary text-white text-sm hover:opacity-90 transition-opacity"
                    >
                        <Plus size={16} />
                        Новий тег
                    </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 dark:text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
                    Керування тегами платформи
                </p>

                <TagsFilters
                    search={search}
                    onSearchChange={setSearch}
                    sortValue={sortValue}
                    onSortChange={handleSortChange}
                    pageSize={pageSize}
                    onPageSizeChange={handlePageSizeChange}
                />

                <div className="flex flex-col gap-2">
                    {isLoadingState
                        ? Array.from({ length: 6 }).map((_, idx) => <Skeleton key={idx} height={52} borderRadius={16} />)
                        : data?.items.length === 0
                            ? <p className="text-sm text-gray-400 dark:text-white/40 text-center py-10">Тегів не знайдено</p>
                            : data?.items.map((tag) => (
                                <TagRow
                                    key={tag.id}
                                    tag={tag}
                                    onEdit={setEditingTag}
                                    onDelete={setDeletingTag}
                                />
                            ))}
                </div>

                {!isLoadingState && data && (
                    <Pagination page={data.page} totalPages={totalPages} totalCount={data.totalCount} onPageChange={setPage} />
                )}
            </div>

            {editingTag && (
                <TagFormModal
                    tag={editingTag === "new" ? null : editingTag}
                    onClose={() => setEditingTag(null)}
                />
            )}

            {deletingTag && (
                <DeleteTagModal tag={deletingTag} onClose={() => setDeletingTag(null)} />
            )}
        </SkeletonTheme>
    );
};

export default AdminTagsPage;