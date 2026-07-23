import { useTranslation } from "react-i18next";
import type { ReportStatusFilter } from "@/hooks/useAdminReportsFilters.ts";
import SortSelect from "@/components/common/SortSelect.tsx";
import PageSizeSelect from "@/components/common/PageSizeSelect.tsx";
import StatusFilterSelect from "@/components/admin/reports/StatusFilterSelect.tsx";

interface ReportsFiltersProps {
    status: ReportStatusFilter;
    onStatusChange: (value: ReportStatusFilter) => void;
    sortValue: string;
    onSortChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
}

const ReportsFilters = ({ status, onStatusChange, sortValue, onSortChange, pageSize, onPageSizeChange }: ReportsFiltersProps) => {
    const { t } = useTranslation('admin');

    const REPORT_SORT_OPTIONS = [
        { value: "CreatedAt:Desc", label: t('sort.newestFirst') },
        { value: "CreatedAt:Asc", label: t('sort.oldestFirst') },
        { value: "ReportsCount:Desc", label: t('sort.mostReports') },
        { value: "ReportsCount:Asc", label: t('sort.leastReports') },
    ];

    return (
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
            <StatusFilterSelect value={status} onChange={onStatusChange} />
            <SortSelect value={sortValue} options={REPORT_SORT_OPTIONS} onChange={onSortChange} />
            <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
        </div>
    );
};

export default ReportsFilters;
