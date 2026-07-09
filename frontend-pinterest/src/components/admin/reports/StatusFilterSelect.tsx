import type { ReportStatusFilter } from "@/hooks/useAdminReportsFilters.ts";
import { REPORT_STATUS_LABELS, REPORT_STATUS_ORDER } from "@/constants/common";

const OPTIONS: { value: ReportStatusFilter; label: string }[] = [
    { value: "all", label: "Усі статуси" },
    ...REPORT_STATUS_ORDER.map((s) => ({ value: s, label: REPORT_STATUS_LABELS[s] })),
];

interface StatusFilterSelectProps {
    value: ReportStatusFilter;
    onChange: (value: ReportStatusFilter) => void;
}

const StatusFilterSelect = ({ value, onChange }: StatusFilterSelectProps) => (
    <select
        value={value}
        onChange={(e) => onChange(e.target.value as ReportStatusFilter)}
        className="w-full sm:w-auto bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
    >
        {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
        ))}
    </select>
);

export default StatusFilterSelect;