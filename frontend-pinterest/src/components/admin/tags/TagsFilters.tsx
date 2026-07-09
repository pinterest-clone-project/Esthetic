import { useEffect, useState } from "react";
import SortSelect from "@/components/common/SortSelect.tsx";
import PageSizeSelect from "@/components/common/PageSizeSelect.tsx";

const TAG_SORT_OPTIONS = [
    { value: "CreatedAt:Desc", label: "Спочатку нові" },
    { value: "CreatedAt:Asc", label: "Спочатку старі" },
    { value: "Name:Asc", label: "За назвою (А-Я)" },
    { value: "Name:Desc", label: "За назвою (Я-А)" },
    { value: "PinsCount:Desc", label: "Найбільше пінів" },
    { value: "PinsCount:Asc", label: "Найменше пінів" },
];

interface TagsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortValue: string;
    onSortChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
}

const TagsFilters = ({
                         search,
                         onSearchChange,
                         sortValue,
                         onSortChange,
                         pageSize,
                         onPageSizeChange,
                     }: TagsFiltersProps) => {
    const [localSearch, setLocalSearch] = useState(search);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (localSearch !== search) onSearchChange(localSearch);
        }, 400);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localSearch]);

    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
            <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Пошук за назвою тегу..."
                className="w-full sm:w-64 bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors placeholder:text-white/30"
            />
            <SortSelect value={sortValue} options={TAG_SORT_OPTIONS} onChange={onSortChange} />
            <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        </div>
    );
};

export default TagsFilters;