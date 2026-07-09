import type { ITagResponse } from "@/types/tag/responses/ITagReponse.ts";
import { useDeleteTagMutation } from "@/services/tagService.ts";
import {useToast} from "@/components/ui/Toast/UseToast.ts";

interface DeleteTagModalProps {
    tag: ITagResponse;
    onClose: () => void;
}

const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "Не вдалося видалити тег. Спробуйте ще раз.";
};

const DeleteTagModal = ({ tag, onClose }: DeleteTagModalProps) => {
    const [deleteTag, { isLoading }] = useDeleteTagMutation();
    const { showToast } = useToast();

    const handleDelete = async () => {
        try {
            await deleteTag(tag.id).unwrap();
            showToast("Тег видалено", "success");
            onClose();
        } catch (err) {
            showToast(getErrorMessage(err), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm bg-[#161616] border border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-2">Видалити тег?</h2>
                <p className="text-sm text-white/50 mb-4">
                    Тег <span className="text-white/80">«{tag.name}»</span> буде видалено остаточно.
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

export default DeleteTagModal;