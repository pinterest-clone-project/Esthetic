import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SortSelect from "@/components/common/SortSelect.tsx";
import PageSizeSelect from "@/components/common/PageSizeSelect.tsx";
interface CategoriesFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    sortValue: string;
    onSortChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
}

const CategoriesFilters = ({
                               search, onSearchChange, sortValue, onSortChange, pageSize, onPageSizeChange,
                           }: CategoriesFiltersProps) => {
    const { t } = useTranslation('admin');
    const [localSearch, setLocalSearch] = useState(search);

    const CATEGORY_SORT_OPTIONS = [
        { value: "CreatedAt:Desc", label: t('sort.newestFirst') },
        { value: "CreatedAt:Asc", label: t('sort.oldestFirst') },
        { value: "Name:Asc", label: t('sort.nameAZ') },
        { value: "Name:Desc", label: t('sort.nameZA') },
        { value: "PinsCount:Desc", label: t('sort.mostPins') },
        { value: "PinsCount:Asc", label: t('sort.leastPins') },
    ];

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
                placeholder={t('categories.search')}
                className="w-full sm:w-64 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/8 rounded-2xl px-4 py-2.5 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-btn-primary/50 transition-colors placeholder:text-gray-400 dark:placeholder:text-white/30"
            />
            <SortSelect value={sortValue} options={CATEGORY_SORT_OPTIONS} onChange={onSortChange} />
            <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        </div>
    );
};

export default CategoriesFilters;
