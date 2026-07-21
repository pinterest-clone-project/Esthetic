import { useState } from "react";
import { useCreateReportMutation } from "@/services/reportService.ts";
import { useTranslation } from "react-i18next";

interface ReportModalProps {
    pinId?: string;
    userId?: string;
    onClose: () => void;
}

const ReportModal = ({ pinId, userId, onClose }: ReportModalProps) => {
    const { t } = useTranslation('common');

    const REPORT_REASONS = [
        { key: "spam",        label: t('report.reasons.spam') },
        { key: "nudity",      label: t('report.reasons.nudity') },
        { key: "harassment",  label: t('report.reasons.harassment') },
        { key: "hateSpeech",  label: t('report.reasons.hateSpeech') },
        { key: "violence",    label: t('report.reasons.violence') },
        { key: "ip",          label: t('report.reasons.ip') },
        { key: "other",       label: t('report.reasons.other') },
    ];

    const [selectedReason, setSelectedReason] = useState<string | null>(null);
    const [details, setDetails] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [createReport, { isLoading }] = useCreateReportMutation();

    const handleSubmit = async () => {
        if (!selectedReason) return;
        setError(null);

        const reason = details.trim()
            ? `${selectedReason} — ${details.trim()}`
            : selectedReason;

        try {
            await createReport({
                reportedPinId: pinId,
                reportedUserId: userId,
                reason,
            }).unwrap();
            setSubmitted(true);
        } catch {
            setError(t('report.failed'));
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {submitted ? (
                    <div className="flex flex-col items-center gap-3 py-4 text-center">
                        <span className="text-[#4ade80] text-2xl">✓</span>
                        <p className="text-white text-sm font-medium">{t('report.thankYou')}</p>
                        <p className="text-gray-500 text-xs">{t('report.reviewSoon')}</p>
                        <button
                            onClick={onClose}
                            className="mt-2 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-1.5 rounded-lg transition-colors"
                        >
                            {t('report.close')}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-sm font-semibold">
                                {pinId ? t('report.titlePin') : t('report.titleUser')}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-white text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex flex-col gap-1.5 mb-4">
                            {REPORT_REASONS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setSelectedReason(key)}
                                    className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                                        selectedReason === key
                                            ? "border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10"
                                            : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder={t('report.detailsPlaceholder')}
                            rows={3}
                            maxLength={500}
                            className="w-full resize-none bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-[#4ade80]/50 mb-2"
                        />

                        {error && <p className="text-red-400 text-xs mb-2">{error}</p>}

                        <div className="flex items-center justify-end gap-2 mt-2">
                            <button
                                onClick={onClose}
                                className="text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                {t('report.cancel')}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedReason || isLoading}
                                className="text-xs text-black bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg font-medium transition-colors"
                            >
                                {isLoading ? t('report.submitting') : t('report.submit')}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportModal;