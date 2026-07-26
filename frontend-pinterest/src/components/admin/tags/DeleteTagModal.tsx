import { useTranslation } from "react-i18next";
import type { ITagResponse } from "@/types/tag/responses/ITagReponse.ts";
import { useDeleteTagMutation } from "@/services/tagService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
interface DeleteTagModalProps {
    tag: ITagResponse;
    onClose: () => void;
}

const getApiErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "";
};

const DeleteTagModal = ({ tag, onClose }: DeleteTagModalProps) => {
    const { t } = useTranslation('admin');
    const [deleteTag, { isLoading }] = useDeleteTagMutation();
    const { showToast } = useToast();

    const handleDelete = async () => {
        try {
            await deleteTag(tag.id).unwrap();
            showToast(t('toast.tagDeleted'), "success");
            onClose();
        } catch (err) {
            showToast(getApiErrorMessage(err) || t('tags.formModal.error'), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{t('tags.deleteModal.title')}</h2>
                <p className="text-sm text-gray-600 dark:text-white/50 mb-4">
                    {t('tags.deleteModal.desc', { name: tag.name })}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-2xl bg-gray-200 dark:bg-white/8 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/15 transition-colors"
                    >
                        {t('tags.deleteModal.cancel')}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-2xl bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                    >
                        {t('tags.deleteModal.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTagModal;
