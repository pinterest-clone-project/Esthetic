import { useMemo } from "react";

interface UsersPaginationProps {
    page: number;
    totalPages: number;
    totalCount: number;
    onPageChange: (page: number) => void;
}

const UsersPagination = ({ page, totalPages, totalCount, onPageChange }: UsersPaginationProps) => {
    const pageItems = useMemo<(number | "...")[]>(() => {
        if (totalPages <= 7) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
        const items: (number | "...")[] = [1];
        if (page > 3) items.push("...");
        const start = Math.max(2, page - 1);
        const end = Math.min(totalPages - 1, page + 1);
        for (let i = start; i <= end; i++) items.push(i);
        if (page < totalPages - 2) items.push("...");
        items.push(totalPages);
        return items;
    }, [page, totalPages]);

    if (totalCount <= 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 text-xs text-white/40">
            <span>
                Сторінка {page} з {totalPages} · Всього {totalCount}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="px-3 py-1.5 rounded-xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Назад
                </button>

                {pageItems.map((item, idx) =>
                    item === "..." ? (
                        <span key={`dots-${idx}`} className="px-2 text-white/30 select-none">
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            onClick={() => onPageChange(item)}
                            className={`min-w-[32px] px-2.5 py-1.5 rounded-xl transition-colors ${
                                item === page
                                    ? "bg-btn-primary/15 text-btn-primary font-medium"
                                    : "bg-white/8 text-white/70 hover:bg-white/15"
                            }`}
                        >
                            {item}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-1.5 rounded-xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    Далі
                </button>
            </div>
        </div>
    );
};

export default UsersPagination;