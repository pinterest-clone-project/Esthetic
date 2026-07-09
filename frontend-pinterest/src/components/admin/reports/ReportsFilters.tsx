import type { ReportStatusFilter } from "@/hooks/useAdminReportsFilters.ts";
import SortSelect from "@/components/common/SortSelect.tsx";
import PageSizeSelect from "@/components/common/PageSizeSelect.tsx";
import StatusFilterSelect from "@/components/admin/reports/StatusFilterSelect.tsx";

const REPORT_SORT_OPTIONS = [
    { value: "CreatedAt:Desc", label: "Спочатку нові" },
    { value: "CreatedAt:Asc", label: "Спочатку старі" },
    { value: "ReportsCount:Desc", label: "Найбільше скарг" },
    { value: "ReportsCount:Asc", label: "Найменше скарг" },
];

interface ReportsFiltersProps {
    status: ReportStatusFilter;
    onStatusChange: (value: ReportStatusFilter) => void;
    sortValue: string;
    onSortChange: (value: string) => void;
    pageSize: number;
    onPageSizeChange: (value: number) => void;
}

const ReportsFilters = ({ status, onStatusChange, sortValue, onSortChange, pageSize, onPageSizeChange }: ReportsFiltersProps) => (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-5">
        <StatusFilterSelect value={status} onChange={onStatusChange} />
        <SortSelect value={sortValue} options={REPORT_SORT_OPTIONS} onChange={onSortChange} />
        <PageSizeSelect value={pageSize} onChange={onPageSizeChange} />
    </div>
);

export default ReportsFilters;