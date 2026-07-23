import { useTranslation } from "react-i18next";
import type { ReportStatusFilter } from "@/hooks/useAdminReportsFilters.ts";
import { ReportStatus } from "@/types/report/ReportStatus.ts";
import { REPORT_STATUS_ORDER } from "@/constants/common";

const STATUS_KEY: Record<number, string> = {
    [ReportStatus.Pending]: 'Pending',
    [ReportStatus.Reviewed]: 'Reviewed',
    [ReportStatus.Resolved]: 'Resolved',
    [ReportStatus.Dismissed]: 'Dismissed',
};

interface StatusFilterSelectProps {
    value: ReportStatusFilter;
    onChange: (value: ReportStatusFilter) => void;
}

const StatusFilterSelect = ({ value, onChange }: StatusFilterSelectProps) => {
    const { t } = useTranslation('admin');

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as ReportStatusFilter)}
            className="w-full sm:w-auto bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
        >
            <option value="all">{t('reports.statusFilter.all')}</option>
            {REPORT_STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{t(`reports.status.${STATUS_KEY[s]}`)}</option>
            ))}
        </select>
    );
};

export default StatusFilterSelect;
