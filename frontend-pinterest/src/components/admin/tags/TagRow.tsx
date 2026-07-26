import { useTranslation } from "react-i18next";
import { Pencil, Trash2 } from "lucide-react";
import type { ITagResponse } from "@/types/tag/responses/ITagReponse.ts";
interface TagRowProps {
    tag: ITagResponse;
    onEdit: (tag: ITagResponse) => void;
    onDelete: (tag: ITagResponse) => void;
}

const TagRow = ({ tag, onEdit, onDelete }: TagRowProps) => {
    const { t } = useTranslation('admin');

    return (
        <div className="flex items-center justify-between gap-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-sm text-gray-800 dark:text-white/80 truncate">{tag.name}</span>
                <span className="shrink-0 text-xs text-gray-500 dark:text-white/40 bg-gray-200 dark:bg-white/8 px-2 py-0.5 rounded-full">
                    {t('tags.pinsCount', { count: tag.pinsCount })}
                </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
                <button
                    onClick={() => onEdit(tag)}
                    className="p-2 rounded-xl bg-gray-200 dark:bg-white/8 text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/15 hover:text-gray-800 dark:hover:text-white transition-colors"
                    aria-label={t('tags.editAriaLabel')}
                >
                    <Pencil size={16} />
                </button>
                <button
                    onClick={() => onDelete(tag)}
                    className="p-2 rounded-xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/20 transition-colors"
                    aria-label={t('tags.deleteAriaLabel')}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default TagRow;
