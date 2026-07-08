import { useEffect, useMemo, useState } from "react";
import { useGetAllCategoriesQuery } from "@/services/categoryService.ts";
import { useGetAllTagsQuery } from "@/services/tagService.ts";
import { useUpdatePinMutation } from "@/services/pinService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { APP_ENV } from "@/constants/env";
import type { IPinResponse } from "@/types/pin/responses/IPinResponses.ts";

interface PinFormModalProps {
    pin: IPinResponse;
    onClose: () => void;
}

const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "Не вдалося зберегти пін. Спробуйте ще раз.";
};

const PinFormModal = ({ pin, onClose }: PinFormModalProps) => {
    const { showToast } = useToast();
    const [updatePin, { isLoading }] = useUpdatePinMutation();
    const { data: categories } = useGetAllCategoriesQuery();
    const { data: tags } = useGetAllTagsQuery();

    const [title, setTitle] = useState(pin.title ?? "");
    const [description, setDescription] = useState(pin.description ?? "");
    const [sourceUrl, setSourceUrl] = useState(pin.sourceUrl ?? "");
    const [mediaUrl, setMediaUrl] = useState("");
    const [categoryId, setCategoryId] = useState(pin.categoryId ?? "");
    const [tagIds, setTagIds] = useState<string[]>(pin.tags.map((tag) => tag.id));
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState(pin.image ? `${APP_ENV.IMAGES_200_URL}${pin.image}` : "");

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

    const selectedTags = useMemo(
        () => tags?.filter((tag) => tagIds.includes(tag.id)) ?? [],
        [tags, tagIds]
    );

    const availableTags = useMemo(
        () => tags?.filter((tag) => !tagIds.includes(tag.id)) ?? [],
        [tags, tagIds]
    );

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setMediaUrl("");
        setPreviewUrl(URL.createObjectURL(file));
        event.target.value = "";
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await updatePin({
                id: pin.id,
                title: title.trim() || undefined,
                description: description.trim() || undefined,
                sourceUrl: sourceUrl.trim() || undefined,
                categoryId: categoryId || undefined,
                tagIds,
                imageFile: imageFile ?? undefined,
                mediaUrl: !imageFile && mediaUrl.trim() ? mediaUrl.trim() : undefined,
            }).unwrap();
            showToast("Пін оновлено", "success");
            onClose();
        } catch (err) {
            showToast(getErrorMessage(err), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
            <form onSubmit={handleSave} className="w-full max-w-2xl max-h-full overflow-y-auto bg-[#161616] border border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-5">Редагувати пін</h2>

                <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                    <div className="flex flex-col gap-3">
                        <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white/8 border border-white/8">
                            {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
                        </div>
                        <label className="text-center text-xs px-3 py-2 rounded-xl bg-white/8 text-white/70 hover:bg-white/15 cursor-pointer transition-colors">
                            Змінити фото
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div className="flex flex-col gap-3">
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Назва"
                            className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50"
                        />
                        <input
                            value={mediaUrl}
                            onChange={(event) => setMediaUrl(event.target.value)}
                            placeholder="URL нового зображення"
                            className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50"
                        />
                        <input
                            value={sourceUrl}
                            onChange={(event) => setSourceUrl(event.target.value)}
                            placeholder="Посилання на джерело"
                            className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50"
                        />
                        <select
                            value={categoryId}
                            onChange={(event) => setCategoryId(event.target.value)}
                            className="bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50"
                        >
                            <option value="">Без категорії</option>
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Опис"
                    rows={4}
                    className="w-full mt-4 bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 resize-none"
                />

                <div className="mt-4">
                    <select
                        value=""
                        onChange={(event) => {
                            if (!event.target.value) return;
                            setTagIds((prev) => [...prev, event.target.value]);
                        }}
                        className="w-full bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50"
                    >
                        <option value="">Додати тег</option>
                        {availableTags.map((tag) => (
                            <option key={tag.id} value={tag.id}>#{tag.name}</option>
                        ))}
                    </select>
                    <div className="flex flex-wrap gap-2 mt-3">
                        {selectedTags.map((tag) => (
                            <button
                                key={tag.id}
                                type="button"
                                onClick={() => setTagIds((prev) => prev.filter((id) => id !== tag.id))}
                                className="text-xs px-2.5 py-1 rounded-full bg-btn-primary/15 text-btn-primary hover:bg-btn-primary/25 transition-colors"
                            >
                                #{tag.name} x
                            </button>
                        ))}
                    </div>
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

export default PinFormModal;
