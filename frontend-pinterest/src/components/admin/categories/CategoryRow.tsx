import { Pencil, Trash2 } from "lucide-react";
import type {ICategory} from "@/types/categories/ICategory.ts";
import {APP_ENV} from "@/constants/env";

interface CategoryRowProps {
    category: ICategory;
    onEdit: (category: ICategory) => void;
    onDelete: (category: ICategory) => void;
}

const CategoryRow = ({ category, onEdit, onDelete }: CategoryRowProps) => (
    <div className="flex items-center justify-between gap-3 bg-white/5 border border-white/8 rounded-2xl px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
            <img
                src={`${APP_ENV.IMAGES_100_URL}${category.image}`}
                alt={category.name}
                className="w-11 h-11 rounded-xl object-cover shrink-0 bg-white/10"
            />
            <div className="min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-white/80 truncate">{category.name}</span>
                    <span className="shrink-0 text-xs text-white/40 bg-white/8 px-2 py-0.5 rounded-full">
                        {category.pinsCount} {category.pinsCount === 1 ? "пін" : "пінів"}
                    </span>
                </div>
                <span className="text-xs text-white/30 truncate block">/{category.slug}</span>
            </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
            <button
                onClick={() => onEdit(category)}
                className="p-2 rounded-xl bg-white/8 text-white/60 hover:bg-white/15 hover:text-white transition-colors"
                aria-label="Редагувати категорію"
            >
                <Pencil size={16} />
            </button>
            <button
                onClick={() => onDelete(category)}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                aria-label="Видалити категорію"
            >
                <Trash2 size={16} />
            </button>
        </div>
    </div>
);

export default CategoryRow;