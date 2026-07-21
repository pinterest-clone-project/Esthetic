import { Pencil, Trash2, UserRound } from "lucide-react";
import { useNavigate } from "react-router";
import { APP_ENV } from "@/constants/env";
import type { IPinSummaryResponse } from "@/types/pin/responses/IPinSummaryResponse.ts";

interface PinRowProps {
    pin: IPinSummaryResponse;
    onEdit: (id: string) => void;
    onDelete: (pin: IPinSummaryResponse) => void;
}

const PinRow = ({ pin, onEdit, onDelete }: PinRowProps) => {
    const navigate = useNavigate();
    return (
    <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
            <img
                src={`${APP_ENV.IMAGES_100_URL}${pin.image}`}
                alt={pin.title ?? "Pin"}
                className="w-12 h-12 rounded-xl object-cover shrink-0 bg-white/10"
            />
            <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-white/80 truncate">{pin.title || "Без назви"}</span>
                    {pin.categoryName && (
                        <span className="shrink-0 text-xs text-white/40 bg-white/8 px-2 py-0.5 rounded-full">
                            {pin.categoryName}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30 mt-0.5">
                    <span>{pin.likesCount} лайків</span>
                    <span>{pin.commentsCount} коментарів</span>
                    <span>{pin.tagsCount} тегів</span>
                </div>
            </div>
        </div>
        <div className="flex gap-2 shrink-0"><button
            onClick={() => navigate(`/user/${pin.creatorId}`)}
            className="p-2 rounded-xl bg-white/8 text-white/60 hover:bg-white/15 hover:text-white transition-colors"
            aria-label="View pin creator"
        ><UserRound size={16} /></button><button
            onClick={() => onEdit(pin.id)}
            className="p-2 rounded-xl bg-white/8 text-white/60 hover:bg-white/15 hover:text-white transition-colors shrink-0"
            aria-label="Редагувати пін"
        >
            <Pencil size={16} />
        </button><button onClick={() => onDelete(pin)} className="p-2 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-colors" aria-label="Delete pin"><Trash2 size={16} /></button></div>
    </div>);
};

export default PinRow;
