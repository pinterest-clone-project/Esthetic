import { useTranslation } from "react-i18next";
import { useDeletePinMutation } from "@/services/pinService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import type { IPinSummaryResponse } from "@/types/pin/responses/IPinSummaryResponse.ts";
const DeletePinModal = ({ pin, onClose }: { pin: IPinSummaryResponse; onClose: () => void }) => {
    const { t } = useTranslation('admin');
    const [deletePin, { isLoading }] = useDeletePinMutation();
    const { showToast } = useToast();

    const confirm = async () => {
        try {
            await deletePin(pin.id).unwrap();
            showToast(t('pins.deleteModal.success'), "success");
            onClose();
        } catch {
            showToast(t('pins.deleteModal.error'), "error");
        }
    };

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
        <div className="w-full max-w-sm rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#161616] p-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{t('pins.deleteModal.title')}</h2>
            <p className="mb-5 text-sm text-gray-600 dark:text-white/55">{t('pins.deleteModal.desc', { name: pin.title || t('pins.deleteModal.untitled') })}</p>
            <div className="flex gap-2"><button onClick={onClose} className="flex-1 rounded-2xl bg-gray-200 dark:bg-white/10 py-2.5 text-gray-700 dark:text-white/75">{t('pins.deleteModal.cancel')}</button><button onClick={confirm} disabled={isLoading} className="flex-1 rounded-2xl bg-red-500 py-2.5 text-white disabled:opacity-50">{t('pins.deleteModal.confirm')}</button></div>
        </div>
    </div>;
};

export default DeletePinModal;
