import {useEffect, useState} from "react";
import {ReportStatus} from "@/types/report/ReportStatus.ts";
import {useUpdateReportStatusMutation} from "@/services/reportService.ts";
import {useBlockUserMutation} from "@/services/userService.ts";
import {useDeletePinMutation} from "@/services/pinService.ts";
import ReportStatusBadge from "@/components/admin/reports/ReportStatusBadge.tsx";
import BlockUserModal from "@/components/admin/users/BlockUserModal.tsx";
import {APP_ENV} from "@/constants/env";
import type {IPinReportGroup} from "@/types/report/responses/IPinReportGroup.ts";
import type {IUser} from "@/types/user/IUser.ts";
import {REPORT_STATUS_STYLES} from "@/constants/common";

const PinReportGroupCard = ({group}: { group: IPinReportGroup }) => {
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
    const [blockUser, {isLoading: isBlocking}] = useBlockUserMutation();
    const [deletePin] = useDeletePinMutation();

    const allResolved = localReports.every((r) => r.status === ReportStatus.Resolved);
    const allDismissed = localReports.every((r) => r.status === ReportStatus.Dismissed);

    // Мінімально потрібний для модалки блокування набір полів автора піна
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
                updateStatus({id: r.id, status})
                    .unwrap()
                    .then(() => ({id: r.id, ok: true}))
                    .catch((e) => {
                        console.error(`Не вдалось оновити статус репорту ${r.id}:`, e);
                        return {id: r.id, ok: false};
                    })
            )
        );

        const okIds = new Set(results.filter((r) => r.ok).map((r) => r.id));

        setLocalReports((prev) =>
            prev.map((r) => (okIds.has(r.id) ? {...r, status} : r))
        );

        const failedCount = results.length - okIds.size;
        if (failedCount > 0) {
            setError(`Не вдалось оновити статус для ${failedCount} скарг(и)`);
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
            await blockUser({id: group.pinCreatorId, reason: blockReason.trim()} as never).unwrap();
            await setStatusForAll(ReportStatus.Resolved, (r) => r.status !== ReportStatus.Resolved);
            setShowBlockModal(false);
            setBlockReason("");
        } catch (e) {
            console.error("Помилка блокування користувача:", e);
            setError("Не вдалось заблокувати користувача");
        }
    };

    const handleDeletePin = async () => {
        if (processing) return;
        setProcessing(true);
        setError(null);
        try {
            await deletePin(group.pinId).unwrap();
            await setStatusForAll(ReportStatus.Resolved, (r) => r.status !== ReportStatus.Resolved);
        } catch (e) {
            console.error("Помилка видалення піна:", e);
            setError("Не вдалось видалити пін");
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
            console.error("Помилка відхилення скарг:", e);
            setError("Не вдалось відхилити скарги");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="bg-[#1a1a1a] border border-white/8 rounded-2xl overflow-hidden">
            <button
                onClick={handleExpand}
                className="w-full flex items-center gap-4 p-4 text-left hover:bg-white/5 transition-colors"
            >
                <div className="w-14 h-14 rounded-xl bg-white/5 overflow-hidden shrink-0">
                    {group.pinImage && (
                        <img src={`${APP_ENV.IMAGES_100_URL}${group.pinImage}`} className="w-full h-full object-cover"/>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">Автор: {group.pinCreatorUserName ?? "—"}</p>
                    <p className="text-xs text-white/40">{new Date(group.latestReportAt).toLocaleString("uk-UA")}</p>
                </div>

                {allResolved ? (
                    <ReportStatusBadge status={ReportStatus.Resolved}/>
                ) : allDismissed ? (
                    <ReportStatusBadge status={ReportStatus.Dismissed}/>
                ) : (
                    <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 ${REPORT_STATUS_STYLES[ReportStatus.Pending]}`}>
                        {group.reportsCount} скарг
                    </span>
                )}

                <svg
                    className={`w-4 h-4 text-white/40 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/>
                </svg>
            </button>

            {expanded && (
                <div className="border-t border-white/8">
                    {error && (
                        <div className="px-4 py-2 text-xs text-red-400 bg-red-500/10 border-b border-white/8">
                            {error}
                        </div>
                    )}

                    <div className="divide-y divide-white/8">
                        {localReports.map((report) => (
                            <div key={report.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white/80">{report.reporterUserName ?? report.reporterId}</p>
                                    <p className="text-xs text-white/40 mt-0.5">{report.reason}</p>
                                    <p className="text-[11px] text-white/30 mt-1">{new Date(report.createdAt).toLocaleString("uk-UA")}</p>
                                </div>
                                <ReportStatusBadge status={report.status}/>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 flex flex-wrap items-center gap-2 border-t border-white/8 bg-white/[0.02]">
                        <a
                            href={`/aura/preview/${group.pinId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl text-xs bg-white/8 text-white/70 hover:bg-white/15 transition-colors"
                        >
                            Переглянути пін
                        </a>

                        <div className="flex-1"/>

                        <button
                            onClick={handleDismiss}
                            disabled={processing}
                            className="px-3 py-1.5 rounded-xl text-xs bg-white/8 text-white/60 hover:bg-white/15 transition-colors disabled:opacity-40"
                        >
                            Залишити
                        </button>
                        <button
                            onClick={() => setShowBlockModal(true)}
                            disabled={processing}
                            className="px-3 py-1.5 rounded-xl text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-40"
                        >
                            Заблокувати автора
                        </button>
                        <button
                            onClick={handleDeletePin}
                            disabled={processing}
                            className="px-3 py-1.5 rounded-xl text-xs bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors disabled:opacity-40"
                        >
                            Видалити пін
                        </button>
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
        </div>
    );
};

export default PinReportGroupCard;