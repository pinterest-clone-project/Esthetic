import { Pencil } from "lucide-react";
import { APP_ENV } from "@/constants/env";
import type { IPinSummaryResponse } from "@/types/pin/responses/IPinSummaryResponse.ts";

interface PinRowProps {
    pin: IPinSummaryResponse;
    onEdit: (id: string) => void;
}

const PinRow = ({ pin, onEdit }: PinRowProps) => (
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
        <button
            onClick={() => onEdit(pin.id)}
            className="p-2 rounded-xl bg-white/8 text-white/60 hover:bg-white/15 hover:text-white transition-colors shrink-0"
            aria-label="Редагувати пін"
        >
            <Pencil size={16} />
        </button>
    </div>
);

export default PinRow;
