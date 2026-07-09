import { useDeleteCategoryMutation } from "@/services/categoryService.ts";
import {useToast} from "@/components/ui/Toast/UseToast.ts";
import type {ICategory} from "@/types/categories/ICategory.ts";

interface DeleteCategoryModalProps {
    category: ICategory;
    onClose: () => void;
}

const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "Не вдалося видалити категорію. Спробуйте ще раз.";
};

const DeleteCategoryModal = ({ category, onClose }: DeleteCategoryModalProps) => {
    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
    const { showToast } = useToast();

    const handleDelete = async () => {
        try {
            await deleteCategory(category.id).unwrap();
            showToast("Категорію видалено", "success");
            onClose();
        } catch (err) {
            showToast(getErrorMessage(err), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm bg-[#161616] border border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-2">Видалити категорію?</h2>
                <p className="text-sm text-white/50 mb-4">
                    Категорія <span className="text-white/80">«{category.name}»</span> буде видалена остаточно.
                    Цю дію не можна скасувати.
                </p>
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-2xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors"
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 py-2.5 rounded-2xl bg-red-500/80 text-white hover:bg-red-500 disabled:opacity-50 transition-colors"
                    >
                        Видалити
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteCategoryModal;