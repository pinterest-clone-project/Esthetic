import type { ReportStatus } from "@/types/report/ReportStatus.ts";
import {REPORT_STATUS_LABELS, REPORT_STATUS_STYLES} from "@/constants/common";

interface ReportStatusBadgeProps {
    status: ReportStatus;
}

const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => (
    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${REPORT_STATUS_STYLES[status]}`}>
        {REPORT_STATUS_LABELS[status]}
    </span>
);

export default ReportStatusBadge;