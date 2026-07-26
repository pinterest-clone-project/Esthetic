import { useTranslation } from "react-i18next";
import { Lock, Pencil, Trash2, Unlock, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { APP_ENV } from "@/constants/env";
import type { MoodboardAdmin } from "@/services/moodboardService.ts";
interface BoardRowProps {
    board: MoodboardAdmin;
    onEdit: (board: MoodboardAdmin) => void;
    onDelete: (board: MoodboardAdmin) => void;
}

const BoardRow = ({ board, onEdit, onDelete }: BoardRowProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation('admin');

    return (
    <div className="flex items-center justify-between gap-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 dark:bg-white/8 shrink-0">
                {board.coverImageUrl ? (
                    <img src={`${APP_ENV.IMAGES_100_URL}${board.coverImageUrl}`} alt={board.title} className="w-full h-full object-cover" />
                ) : null}
            </div>
            <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-gray-800 dark:text-white/80 truncate">{board.title || t('boards.untitled')}</span>
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs text-gray-500 dark:text-white/40 bg-gray-200 dark:bg-white/8 px-2 py-0.5 rounded-full">
                        {board.isPrivate ? <Lock size={12} /> : <Unlock size={12} />}
                        {board.isPrivate ? t('boards.private') : t('boards.public')}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/30 mt-0.5">
                    <span>{t('boards.pinsCount', { count: board.pinsCount })}</span>
                    {board.isArchived && <span>{t('boards.archived')}</span>}
                </div>
            </div>
        </div>
        <div className="flex gap-2 shrink-0"><button onClick={() => navigate(`/user/${board.ownerId}`)} className="p-2 rounded-xl bg-gray-200 dark:bg-white/8 text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/15"><UserRound size={16} /></button><button
            onClick={() => onEdit(board)}
            className="p-2 rounded-xl bg-gray-200 dark:bg-white/8 text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/15 hover:text-gray-800 dark:hover:text-white transition-colors shrink-0"
            aria-label={t('boards.editAriaLabel')}
        >
            <Pencil size={16} />
        </button><button onClick={() => onDelete(board)} className="p-2 rounded-xl bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-500/20"><Trash2 size={16} /></button></div>
    </div>
); };

export default BoardRow;
