import { useTranslation } from "react-i18next";
import type { UserSortBy } from "@/types/user/UserSortBy.ts";
import type { SortDirection } from "@/types/SortDirection.ts";
import { PAGE_SIZE_OPTIONS, SORT_OPTIONS, type StatusFilter } from "@/constants/common";

interface UsersFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    status: StatusFilter;
    onStatusChange: (value: StatusFilter) => void;
    sortValue: `${UserSortBy}:${SortDirection}`;
    onSortChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
}

const SORT_KEY_MAP: Record<string, string> = {
    'CreatedAt:Desc': 'sort.registeredNewest',
    'CreatedAt:Asc': 'sort.registeredOldest',
    'UserName:Asc': 'sort.nameForward',
    'UserName:Desc': 'sort.nameBackward',
};

const UsersFilters = ({
                          search,
                          onSearchChange,
                          status,
                          onStatusChange,
                          sortValue,
                          onSortChange,
                          pageSize,
                          onPageSizeChange,
                      }: UsersFiltersProps) => {
    const { t } = useTranslation('admin');

    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
            <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('users.search')}
                className="flex-1 min-w-[180px] bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-btn-primary/50 transition-colors"
            />
            <select
                value={status}
                onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
                className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
            >
                <option value="all">{t('users.filters.all')}</option>
                <option value="active">{t('users.filters.active')}</option>
                <option value="blocked">{t('users.filters.blocked')}</option>
            </select>
            <select
                value={sortValue}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {SORT_KEY_MAP[opt.value] ? t(SORT_KEY_MAP[opt.value]) : opt.label}
                    </option>
                ))}
            </select>
            <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
            >
                {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                        {t('pageSize', { size })}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default UsersFilters;
