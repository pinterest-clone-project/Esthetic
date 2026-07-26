import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import type { INews } from "@/types/news/INews";
import { APP_ENV } from "@/constants/env";

interface NewsRowProps {
    news: INews;
    onEdit: (news: INews) => void;
    onDelete: (news: INews) => void;
}

const NewsRow = ({ news, onEdit, onDelete }: NewsRowProps) => {
    const { t, i18n } = useTranslation('admin');
    const title = i18n.language === 'uk' ? news.titleUk : news.titleEn;

    return (
        <div className="flex items-center justify-between gap-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
                {news.image ? (
                    <img
                        src={`${APP_ENV.IMAGES_400_URL}${news.image}`}
                        alt={title}
                        className="w-11 h-11 rounded-xl object-cover shrink-0 bg-gray-200 dark:bg-white/10"
                    />
                ) : (
                    <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-white/10 shrink-0" />
                )}
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-800 dark:text-white/80 truncate">{title}</span>
                        <span className="shrink-0 text-xs text-gray-500 dark:text-white/40 bg-gray-200 dark:bg-white/8 px-2 py-0.5 rounded-full">
                            {news.tag}
                        </span>
                        {news.isFeatured && (
                            <span className="shrink-0 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-400/10 px-2 py-0.5 rounded-full">
                                {t('news.featured')}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-white/30 block">
                        {new Date(news.publishedAt).toLocaleDateString(i18n.language)}
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    onClick={() => onEdit(news)}
                    className="p-2 rounded-xl bg-gray-200 dark:bg-white/8 text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/15 hover:text-gray-800 dark:hover:text-white transition-colors"
                    aria-label={t('news.editAriaLabel')}
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={() => onDelete(news)}
                    className="p-2 rounded-xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                    aria-label={t('news.deleteAriaLabel')}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default NewsRow;
