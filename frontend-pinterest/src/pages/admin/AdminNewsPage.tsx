import { useState } from "react";
import { Plus } from "lucide-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useTranslation } from "react-i18next";
import { useGetAllNewsQuery } from "@/services/newsService.ts";
import type { INews } from "@/types/news/INews.ts";
import NewsRow from "@/components/admin/news/NewsRow.tsx";
import NewsFormModal from "@/components/admin/news/NewsFormModal.tsx";
import DeleteNewsModal from "@/components/admin/news/DeleteNewsModal.tsx";

const AdminNewsPage = () => {
    const { t } = useTranslation('admin');
    const { data, isLoading } = useGetAllNewsQuery();

    const [editingNews, setEditingNews] = useState<INews | null | "new">(null);
    const [deletingNews, setDeletingNews] = useState<INews | null>(null);

    return (
        <SkeletonTheme baseColor="#202020" highlightColor="#333333">
            <div className="relative z-10 w-full max-w-full overflow-x-hidden">
                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-[-0.5px]">{t('sections.news')}</h1>
                    <button
                        onClick={() => setEditingNews("new")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-btn-primary text-white text-sm hover:opacity-90 transition-opacity"
                    >
                        <Plus size={16} />
                        {t('news.new')}
                    </button>
                </div>
                <p className="text-xs sm:text-sm text-white/30 mb-6 sm:mb-8 tracking-[-0.3px]">
                    {t('news.subtitle')}
                </p>

                <div className="flex flex-col gap-2">
                    {isLoading
                        ? Array.from({ length: 4 }).map((_, idx) => (
                            <Skeleton key={idx} height={68} borderRadius={16} />
                        ))
                        : !data?.length
                            ? <p className="text-sm text-white/40 text-center py-10">{t('news.empty')}</p>
                            : data.map((item) => (
                                <NewsRow
                                    key={item.id}
                                    news={item}
                                    onEdit={setEditingNews}
                                    onDelete={setDeletingNews}
                                />
                            ))}
                </div>
            </div>

            {editingNews && (
                <NewsFormModal
                    news={editingNews === "new" ? null : editingNews}
                    onClose={() => setEditingNews(null)}
                />
            )}

            {deletingNews && (
                <DeleteNewsModal
                    news={deletingNews}
                    onClose={() => setDeletingNews(null)}
                />
            )}
        </SkeletonTheme>
    );
};

export default AdminNewsPage;
