import { useTranslation } from "react-i18next";
import type { IUser } from "@/types/user/IUser.ts";
interface BlockReasonModalProps {
    target: IUser;
    onClose: () => void;
}

const BlockReasonModal = ({ target, onClose }: BlockReasonModalProps) => {
    const { t } = useTranslation('admin');

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-sm">
                <h3 className="text-base font-semibold tracking-[-0.3px] mb-1 text-gray-900 dark:text-white">
                    {t('users.reasonModal.title')}
                </h3>
                <p className="text-xs text-gray-500 dark:text-white/40 mb-4">
                    {target.userName}
                </p>
                <div className="bg-gray-200 dark:bg-[#121212] border border-gray-300 dark:border-white/8 rounded-xl px-3 py-2.5 text-sm text-gray-800 dark:text-white/80 whitespace-pre-wrap break-words">
                    {target.blockReason}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs text-gray-600 dark:text-white/60 hover:bg-gray-300 dark:hover:bg-white/8 transition-colors"
                    >
                        {t('users.reasonModal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockReasonModal;
