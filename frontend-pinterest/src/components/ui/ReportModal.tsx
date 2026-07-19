import { useState } from "react";
import { useCreateReportMutation } from "@/services/reportService.ts";

interface ReportModalProps {
    pinId?: string;
    userId?: string;
    onClose: () => void;
}

const REPORT_REASONS = [
    "Spam or misleading",
    "Nudity or sexual content",
    "Harassment or bullying",
    "Hate speech or symbols",
    "Violence or dangerous content",
    "Intellectual property violation",
    "Other",
];

const ReportModal = ({ pinId, userId, onClose }: ReportModalProps) => {
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
            setError("Failed to submit report. Please try again.");
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
                        <p className="text-white text-sm font-medium">Thank you for your report</p>
                        <p className="text-gray-500 text-xs">Our team will review it shortly.</p>
                        <button
                            onClick={onClose}
                            className="mt-2 text-xs text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-4 py-1.5 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-white text-sm font-semibold">
                                Report {pinId ? "pin" : "user"}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-white text-lg leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="flex flex-col gap-1.5 mb-4">
                            {REPORT_REASONS.map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => setSelectedReason(reason)}
                                    className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                                        selectedReason === reason
                                            ? "border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10"
                                            : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                                    }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Add details (optional)"
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
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedReason || isLoading}
                                className="text-xs text-black bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-40 disabled:cursor-not-allowed px-4 py-1.5 rounded-lg font-medium transition-colors"
                            >
                                {isLoading ? "Submitting..." : "Submit report"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportModal;