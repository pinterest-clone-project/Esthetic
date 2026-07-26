import { useTranslation } from "react-i18next";
import type { IUser } from "@/types/user/IUser.ts";
interface BlockUserModalProps {
    target: IUser;
    reason: string;
    onReasonChange: (value: string) => void;
    onCancel: () => void;
    onConfirm: () => void;
    isBlocking: boolean;
}

const BlockUserModal = ({ target, reason, onReasonChange, onCancel, onConfirm, isBlocking }: BlockUserModalProps) => {
    const { t } = useTranslation('admin');

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-sm">
                <h3 className="text-base font-semibold tracking-[-0.3px] mb-1 text-gray-900 dark:text-white">
                    {t('users.blockModal.title', { username: target.userName })}
                </h3>
                <p className="text-xs text-gray-500 dark:text-white/40 mb-4">
                    {t('users.blockModal.subtitle')}
                </p>
                <textarea
                    value={reason}
                    onChange={(e) => onReasonChange(e.target.value)}
                    placeholder={t('users.blockModal.placeholder')}
                    maxLength={250}
                    rows={3}
                    className="w-full bg-gray-200 dark:bg-[#121212] border border-gray-300 dark:border-white/8 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 outline-none focus:border-btn-primary/50 transition-colors resize-none"
                />
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-xl text-xs text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/8 transition-colors"
                    >
                        {t('users.blockModal.cancel')}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={!reason.trim() || isBlocking}
                        className="px-4 py-2 rounded-xl text-xs bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/25 transition-colors disabled:opacity-40"
                    >
                        {t('users.blockModal.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockUserModal;
