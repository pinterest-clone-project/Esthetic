import { useEffect, useState } from "react";
import SortSelect from "@/components/common/SortSelect.tsx";
import PageSizeSelect from "@/components/common/PageSizeSelect.tsx";

const PIN_SORT_OPTIONS = [
    { value: "CreatedAt:Desc", label: "Спочатку нові" },
    { value: "CreatedAt:Asc", label: "Спочатку старі" },
    { value: "Title:Asc", label: "За назвою (А-Я)" },
    { value: "Title:Desc", label: "За назвою (Я-А)" },
    { value: "LikesCount:Desc", label: "Найбільше лайків" },
    { value: "CommentsCount:Desc", label: "Найбільше коментарів" },
];

interface PinsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortValue: string;
    onSortChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
}

const PinsFilters = ({ search, onSearchChange, sortValue, onSortChange, pageSize, onPageSizeChange }: PinsFiltersProps) => {
    const [localSearch, setLocalSearch] = useState(search);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localSearch !== search) onSearchChange(localSearch);
        }, 400);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localSearch]);

    useEffect(() => setLocalSearch(search), [search]);

    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
            <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Пошук за назвою, описом, джерелом, категорією чи тегом..."
                className="w-full sm:w-96 bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors placeholder:text-white/30"
            />
            <SortSelect value={sortValue} options={PIN_SORT_OPTIONS} onChange={onSortChange} />
            <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        </div>
    );
};

export default PinsFilters;
