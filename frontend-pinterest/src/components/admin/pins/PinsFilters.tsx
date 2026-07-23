import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SortSelect from "@/components/common/SortSelect.tsx";
import PageSizeSelect from "@/components/common/PageSizeSelect.tsx";

interface PinsFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortValue: string;
    onSortChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
}

const PinsFilters = ({ search, onSearchChange, sortValue, onSortChange, pageSize, onPageSizeChange }: PinsFiltersProps) => {
    const { t } = useTranslation('admin');
    const [localSearch, setLocalSearch] = useState(search);

    const PIN_SORT_OPTIONS = [
        { value: "CreatedAt:Desc", label: t('sort.newestFirst') },
        { value: "CreatedAt:Asc", label: t('sort.oldestFirst') },
        { value: "Title:Asc", label: t('sort.nameAZ') },
        { value: "Title:Desc", label: t('sort.nameZA') },
        { value: "LikesCount:Desc", label: t('sort.mostLikes') },
        { value: "CommentsCount:Desc", label: t('sort.mostComments') },
    ];

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
                placeholder={t('pins.search')}
                className="w-full sm:w-96 bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors placeholder:text-white/30"
            />
            <SortSelect value={sortValue} options={PIN_SORT_OPTIONS} onChange={onSortChange} />
            <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        </div>
    );
};

export default PinsFilters;
