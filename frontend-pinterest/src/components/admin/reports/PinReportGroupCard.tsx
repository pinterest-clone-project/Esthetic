import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReportStatus } from "@/types/report/ReportStatus.ts";
import { useUpdateReportStatusMutation } from "@/services/reportService.ts";
import { useBlockUserMutation } from "@/services/userService.ts";
import { useAdminRestorePinMutation, useDeletePinMutation } from "@/services/pinService.ts";
import ReportStatusBadge from "@/components/admin/reports/ReportStatusBadge.tsx";
import BlockUserModal from "@/components/admin/users/BlockUserModal.tsx";
import { APP_ENV } from "@/constants/env";
import type { IPinReportGroup } from "@/types/report/responses/IPinReportGroup.ts";
import type { IUser } from "@/types/user/IUser.ts";
import { REPORT_STATUS_STYLES } from "@/constants/common";
export const PinReportGroupCard = ({ group }: { group: IPinReportGroup }) => {
    const { t, i18n } = useTranslation('admin');
    const [expanded, setExpanded] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [blockReason, setBlockReason] = useState("");

    const [localReports, setLocalReports] = useState(group.reports);

    useEffect(() => {
        setLocalReports(group.reports);
    }, [group.reports]);

    const [updateStatus] = useUpdateReportStatusMutation();
    const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();
    const [deletePin] = useDeletePinMutation();
    const [restorePin] = useAdminRestorePinMutation();
    const [isDeleted, setIsDeleted] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const allResolved = localReports.every((r) => r.status === ReportStatus.Resolved);
    const allDismissed = localReports.every((r) => r.status === ReportStatus.Dismissed);

    const blockTarget: IUser = {
        id: group.pinCreatorId,
        userName: group.pinCreatorUserName ?? "—",
    } as IUser;

    const setStatusForAll = async (
        status: ReportStatus,
        predicate: (r: (typeof localReports)[number]) => boolean
    ) => {
        const targets = localReports.filter(predicate);
        if (targets.length === 0) return;

        const results = await Promise.all(
            targets.map((r) =>
                updateStatus({ id: r.id, status })
                    .unwrap()
                    .then(() => ({ id: r.id, ok: true }))
                    .catch((e) => {
                        console.error(`Failed to update report status ${r.id}:`, e);
                        return { id: r.id, ok: false };
                    })
            )
        );

        const okIds = new Set(results.filter((r) => r.ok).map((r) => r.id));

        setLocalReports((prev) =>
            prev.map((r) => (okIds.has(r.id) ? { ...r, status } : r))
        );

        const failedCount = results.length - okIds.size;
        if (failedCount > 0) {
            setError(t('reports.errors.updateMultiple', { count: failedCount }));
        }
    };

    const handleExpand = () => {
        setExpanded((v) => {
            const next = !v;
            if (next) {
                void setStatusForAll(ReportStatus.Reviewed, (r) => r.status === ReportStatus.Pending);
            }
            return next;
        });
    };

    const handleBlockConfirm = async () => {
        if (!blockReason.trim()) return;
        setError(null);
        try {
            await blockUser({ id: group.pinCreatorId, reason: blockReason.trim() } as never).unwrap();
            await setStatusForAll(ReportStatus.Resolved, (r) => r.status !== ReportStatus.Resolved);
            setShowBlockModal(false);
            setBlockReason("");
        } catch (e) {
            console.error("Block user error:", e);
            setError(t('reports.errors.blockUserFailed'));
        }
    };

    const handleDeletePin = async () => {
        if (processing) return;
        setProcessing(true);
        setError(null);
        try {
            await deletePin(group.pinId).unwrap();
            setIsDeleted(true);
            await setStatusForAll(ReportStatus.Resolved, (r) => r.status !== ReportStatus.Resolved);
        } catch (e) {
            console.error("Delete pin error:", e);
            setError(t('reports.errors.deletePinFailed'));
        } finally {
            setProcessing(false);
        }
    };

    const handleRestorePin = async () => {
        if (processing) return;
        setProcessing(true);
        setError(null);
        try {
            await restorePin(group.pinId).unwrap();
            setIsDeleted(false);
        } catch {
            setError(t('reports.errors.restorePinFailed'));
        } finally {
            setProcessing(false);
        }
    };

    const handleDismiss = async () => {
        if (processing) return;
        setProcessing(true);
        setError(null);
        try {
            await setStatusForAll(ReportStatus.Dismissed, (r) => r.status !== ReportStatus.Dismissed);
        } catch (e) {
            console.error("Dismiss reports error:", e);
            setError(t('reports.errors.dismissFailed'));
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-[#18181b]/90 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden transition-all duration-200 shadow-lg shadow-black/20">
            {/* Header Card Button */}
            <button
                onClick={handleExpand}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-200 dark:hover:bg-white/[0.03] active:bg-gray-300 dark:active:bg-white/[0.05] transition-colors"
            >
                {/* Pin Image / Placeholder */}
                <div className="relative w-12 h-12 rounded-xl bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {group.pinImage ? (
                        <img
                            src={`${APP_ENV.IMAGES_100_URL}${group.pinImage}`}
                            className="w-full h-full object-cover"
                            alt={t('reports.pin')}
                        />
                    ) : (
                        <svg className="w-5 h-5 text-gray-400 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    )}
                </div>

                {/* Main Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-white/40 font-medium">{t('reports.author')}</span>
                        <span className="text-sm font-semibold text-gray-800 dark:text-white/90 truncate">
                            {group.pinCreatorUserName ?? "—"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 dark:text-white/40">
                        <svg className="w-3.5 h-3.5 text-gray-400 dark:text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Date(group.latestReportAt).toLocaleString(i18n.language)}</span>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-3 shrink-0">
                    {allResolved ? (
                        <ReportStatusBadge status={ReportStatus.Resolved} />
                    ) : allDismissed ? (
                        <ReportStatusBadge status={ReportStatus.Dismissed} />
                    ) : (
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide ${REPORT_STATUS_STYLES[ReportStatus.Pending]}`}>
                            {t('reports.reportsCount', { count: group.reportsCount })}
                        </span>
                    )}

                    {/* Chevron icon */}
                    <div className={`p-1 rounded-lg text-gray-500 dark:text-white/40 transition-transform duration-200 ${expanded ? "rotate-180 bg-gray-200 dark:bg-white/5 text-gray-800 dark:text-white/80" : ""}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </button>

            {/* Expanded Details Section */}
            {expanded && (
                <div className="border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                    {error && (
                        <div className="px-4 py-2.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 border-b border-red-200 dark:border-red-500/20 flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Reports List */}
                    <div className="divide-y divide-gray-200 dark:divide-white/5 px-2">
                        {localReports.map((report) => (
                            <div key={report.id} className="p-3 my-1 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1 min-w-0 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-gray-800 dark:text-white/90">
                                            {report.reporterUserName ?? report.reporterId}
                                        </span>
                                        <span className="text-[11px] text-gray-400 dark:text-white/30">•</span>
                                        <span className="text-[11px] text-gray-500 dark:text-white/40">
                                            {new Date(report.createdAt).toLocaleString(i18n.language)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-amber-700 dark:text-amber-200/80 font-medium bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2 py-0.5 rounded-md inline-block">
                                        {report.reason}
                                    </p>
                                </div>
                                <div className="self-start sm:self-center">
                                    <ReportStatusBadge status={report.status} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Action Bar */}
                    <div className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-white/[0.01]">
                        <a
                            href={`/aura/preview/${group.pinId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-white/70 bg-white/5 hover:bg-white/10 hover:text-white border border-white/10 transition-all"
                        >
                            <span>{t('reports.viewPin')}</span>
                            <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>

                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <button
                                onClick={handleDismiss}
                                disabled={processing}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-white/70 bg-white/5 hover:bg-white/10 hover:text-white transition-all disabled:opacity-40 border border-white/5"
                            >
                                {t('reports.keep')}
                            </button>
                            <button
                                onClick={() => setShowBlockModal(true)}
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-40"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                <span>{t('reports.blockAuthor')}</span>
                            </button>
                            <button
                                onClick={isDeleted ? handleRestorePin : () => setShowDeleteModal(true)}
                                disabled={processing}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-all disabled:opacity-40"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>{t('reports.deletePin')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showBlockModal && (
                <BlockUserModal
                    target={blockTarget}
                    reason={blockReason}
                    onReasonChange={setBlockReason}
                    onCancel={() => {
                        setShowBlockModal(false);
                        setBlockReason("");
                    }}
                    onConfirm={handleBlockConfirm}
                    isBlocking={isBlocking}
                />
            )}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#161616] p-6">
                        <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('reports.deleteModal.title')}</h2>
                        <p className="mb-5 text-sm text-gray-600 dark:text-white/55">{t('reports.deleteModal.desc')}</p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 rounded-2xl bg-gray-200 dark:bg-white/10 py-2.5 text-gray-700 dark:text-white/75">{t('reports.deleteModal.cancel')}</button>
                            <button onClick={() => { setShowDeleteModal(false); void handleDeletePin(); }} className="flex-1 rounded-2xl bg-red-500 py-2.5 text-white">{t('reports.deleteModal.confirm')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PinReportGroupCard;
