import { useTranslation } from "react-i18next";
import { ReportStatus, type ReportStatus as ReportStatusType } from "@/types/report/ReportStatus.ts";
import { REPORT_STATUS_STYLES } from "@/constants/common";

const STATUS_KEY: Record<ReportStatusType, string> = {
    [ReportStatus.Pending]: 'Pending',
    [ReportStatus.Reviewed]: 'Reviewed',
    [ReportStatus.Resolved]: 'Resolved',
    [ReportStatus.Dismissed]: 'Dismissed',
};

interface ReportStatusBadgeProps {
    status: ReportStatusType;
}

const ReportStatusBadge = ({ status }: ReportStatusBadgeProps) => {
    const { t } = useTranslation('admin');

    return (
        <span className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${REPORT_STATUS_STYLES[status]}`}>
            {t(`reports.status.${STATUS_KEY[status]}`)}
        </span>
    );
};

export default ReportStatusBadge;
