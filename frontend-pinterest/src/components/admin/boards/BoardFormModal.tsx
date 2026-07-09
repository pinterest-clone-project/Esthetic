import { useEffect, useState } from "react";
import { useUpdateMoodboardMutation, type MoodboardAdmin } from "@/services/moodboardService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { APP_ENV } from "@/constants/env";

interface BoardFormModalProps {
    board: MoodboardAdmin;
    onClose: () => void;
}

const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "Не вдалося зберегти дошку. Спробуйте ще раз.";
};

const BoardFormModal = ({ board, onClose }: BoardFormModalProps) => {
    const { showToast } = useToast();
    const [updateBoard, { isLoading }] = useUpdateMoodboardMutation();
    const [title, setTitle] = useState(board.title ?? "");
    const [description, setDescription] = useState(board.description ?? "");
    const [isPrivate, setIsPrivate] = useState(board.isPrivate);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState(board.coverImageUrl ? `${APP_ENV.IMAGES_200_URL}${board.coverImageUrl}` : "");

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    useEffect(() => {
        if (!previewUrl.startsWith("blob:")) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setCoverImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        event.target.value = "";
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!title.trim()) {
            showToast("Назва дошки обов'язкова", "error");
            return;
        }

        try {
            await updateBoard({
                id: board.id,
                title: title.trim(),
                description: description.trim(),
                isPrivate,
                coverImageFile: coverImageFile ?? undefined,
            }).unwrap();
            showToast("Дошку оновлено", "success");
            onClose();
        } catch (err) {
            showToast(getErrorMessage(err), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
            <form onSubmit={handleSave} className="w-full max-w-md bg-[#161616] border border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-5">Редагувати дошку</h2>

                <div className="flex justify-center mb-4">
                    <label className="w-28 h-28 rounded-2xl overflow-hidden bg-white/8 border border-white/8 flex items-center justify-center cursor-pointer hover:border-btn-primary/50 transition-colors">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-white/40">Обкладинка</span>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Назва дошки"
                        className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50"
                    />
                    <textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Опис"
                        rows={4}
                        className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 resize-none"
                    />
                    <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-[#1a1a1a] px-4 py-3 text-sm text-white/70">
                        <span>Приватна дошка</span>
                        <input
                            type="checkbox"
                            checked={isPrivate}
                            onChange={(event) => setIsPrivate(event.target.checked)}
                            className="h-4 w-4 accent-btn-primary"
                        />
                    </label>
                </div>

                <div className="flex gap-2 mt-6">
                    <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-2xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors">
                        Скасувати
                    </button>
                    <button type="submit" disabled={isLoading} className="flex-1 py-2.5 rounded-2xl bg-btn-primary text-white disabled:opacity-50 transition-colors">
                        Зберегти
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BoardFormModal;
