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
            <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 sm:p-6 w-full max-w-sm">
                <h3 className="text-base font-semibold tracking-[-0.3px] mb-1">
                    {t('users.reasonModal.title')}
                </h3>
                <p className="text-xs text-white/40 mb-4">
                    {target.userName}
                </p>
                <div className="bg-[#121212] border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white/80 whitespace-pre-wrap break-words">
                    {target.blockReason}
                </div>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-xs text-white/60 hover:bg-white/8 transition-colors"
                    >
                        {t('users.reasonModal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlockReasonModal;
