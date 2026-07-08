import { Pencil, Trash2 } from "lucide-react";
import type {ITagResponse} from "@/types/tag/responses/ITagReponse.ts";

interface TagRowProps {
    tag: ITagResponse;
    onEdit: (tag: ITagResponse) => void;
    onDelete: (tag: ITagResponse) => void;
}

const TagRow = ({ tag, onEdit, onDelete }: TagRowProps) => (
    <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
        <span className="text-sm text-white/80 truncate">{tag.name}</span>
        <div className="flex items-center gap-1.5 shrink-0">
            <button
                onClick={() => onEdit(tag)}
                className="p-2 rounded-xl bg-white/8 text-white/60 hover:bg-white/15 hover:text-white transition-colors"
                aria-label="Редагувати тег"
            >
                <Pencil size={16} />
            </button>
            <button
                onClick={() => onDelete(tag)}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                aria-label="Видалити тег"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </div>
);

export default TagRow;