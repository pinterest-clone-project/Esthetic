import { useTranslation } from "react-i18next";
import { useDeleteCategoryMutation } from "@/services/categoryService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import type { ICategory } from "@/types/categories/ICategory.ts";
interface DeleteCategoryModalProps {
    category: ICategory;
    onClose: () => void;
}

const getApiErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "";
};

const DeleteCategoryModal = ({ category, onClose }: DeleteCategoryModalProps) => {
    const { t } = useTranslation('admin');
    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
    const { showToast } = useToast();

    const handleDelete = async () => {
        try {
            await deleteCategory(category.id).unwrap();
            showToast(t('toast.categoryDeleted'), "success");
            onClose();
        } catch (err) {
            showToast(getApiErrorMessage(err) || t('categories.formModal.error'), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{t('categories.deleteModal.title')}</h2>
                <p className="text-sm text-gray-600 dark:text-white/50 mb-4">
                    {t('categories.deleteModal.desc', { name: category.name })}
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-2xl bg-gray-200 dark:bg-white/8 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/15 transition-colors"
                    >
                        {t('categories.deleteModal.cancel')}
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-2xl bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                    >
                        {t('categories.deleteModal.confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;
