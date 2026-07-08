import { Lock, Pencil, Unlock } from "lucide-react";
import { APP_ENV } from "@/constants/env";
import type { MoodboardAdmin } from "@/services/moodboardService.ts";

interface BoardRowProps {
    board: MoodboardAdmin;
    onEdit: (board: MoodboardAdmin) => void;
}

const BoardRow = ({ board, onEdit }: BoardRowProps) => (
    <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/8 shrink-0">
                {board.coverImageUrl ? (
                    <img src={`${APP_ENV.IMAGES_100_URL}${board.coverImageUrl}`} alt={board.title} className="w-full h-full object-cover" />
                ) : null}
            </div>
            <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-white/80 truncate">{board.title || "Без назви"}</span>
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs text-white/40 bg-white/8 px-2 py-0.5 rounded-full">
                        {board.isPrivate ? <Lock size={12} /> : <Unlock size={12} />}
                        {board.isPrivate ? "Приватна" : "Публічна"}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30 mt-0.5">
                    <span>{board.pinsCount} пінів</span>
                    {board.isArchived && <span>Архівована</span>}
                </div>
            </div>
        </div>
        <button
            onClick={() => onEdit(board)}
            className="p-2 rounded-xl bg-white/8 text-white/60 hover:bg-white/15 hover:text-white transition-colors shrink-0"
            aria-label="Редагувати дошку"
        >
            <Pencil size={16} />
        </button>
    </div>
);

export default BoardRow;
