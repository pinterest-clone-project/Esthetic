import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetAllCategoriesQuery } from "@/services/categoryService.ts";
import { useGetAllTagsQuery } from "@/services/tagService.ts";
import { useUpdatePinMutation } from "@/services/pinService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import { APP_ENV } from "@/constants/env";
import type { IPinResponse } from "@/types/pin/responses/IPinResponses.ts";
import ImageCropperModal from "@/components/ui/ImageCropperModal.tsx";
interface PinFormModalProps {
    pin: IPinResponse;
    onClose: () => void;
}

const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "";
};

const PinFormModal = ({ pin, onClose }: PinFormModalProps) => {
    const { t } = useTranslation('admin');
    const { showToast } = useToast();
    const [updatePin, { isLoading }] = useUpdatePinMutation();
    const { data: categories } = useGetAllCategoriesQuery();
    const { data: tags } = useGetAllTagsQuery();

    const [title, setTitle] = useState(pin.title ?? "");
    const [description, setDescription] = useState(pin.description ?? "");
    const [sourceUrl, setSourceUrl] = useState(pin.sourceUrl ?? "");
    const [categoryId, setCategoryId] = useState(pin.categoryId ?? "");
    const [tagIds, setTagIds] = useState<string[]>(pin.tags.map((tag) => tag.id));
    const imageFile = useRef<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState(pin.image ? `${APP_ENV.IMAGES_1200_URL}${pin.image}` : "");
    const [showCropper, setShowCropper] = useState(false);
    const [cropperImageSrc, setCropperImageSrc] = useState("");
    const [categorySearch, setCategorySearch] = useState("");
    const [tagSearch, setTagSearch] = useState("");

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

    useEffect(() => {
        if (!cropperImageSrc) return;
        return () => URL.revokeObjectURL(cropperImageSrc);
    }, [cropperImageSrc]);

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
        setCropperImageSrc(URL.createObjectURL(file));
        setShowCropper(true);
        event.target.value = "";
    };

    const handleCropComplete = (croppedFile: File) => {
        imageFile.current = croppedFile;
        setPreviewUrl(URL.createObjectURL(croppedFile));
        setShowCropper(false);
        setCropperImageSrc("");
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
                imageFile: imageFile.current ?? undefined,
            }).unwrap();
            showToast(t('toast.pinUpdated'), "success");
            onClose();
        } catch (err) {
            showToast(getErrorMessage(err) || t('pins.formModal.error'), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
            <form onSubmit={handleSave} className="w-full max-w-2xl max-h-full overflow-y-auto bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white">{t('pins.formModal.title')}</h2>

                <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                    <div className="flex flex-col gap-3">
                        <div className="w-40 h-40 rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/8 border border-gray-300 dark:border-white/8">
                            {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />}
                        </div>
                        <label className="text-center text-xs px-3 py-2 rounded-xl bg-gray-200 dark:bg-white/8 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/15 cursor-pointer transition-colors">
                            {t('pins.formModal.changePhoto')}
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div className="flex flex-col gap-3">
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="Назва"
                            className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-2xl px-4 py-2.5 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-btn-primary/50"
                        />
                        <input
                            value={sourceUrl}
                            onChange={(event) => setSourceUrl(event.target.value)}
                            placeholder="Посилання на джерело"
                            className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-2xl px-4 py-2.5 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-btn-primary/50"
                        />
                        <div className="relative">
                            <input
                                value={categorySearch}
                                onChange={(event) => setCategorySearch(event.target.value)}
                                placeholder={categoryId && categories?.find(c => c.id === categoryId)?.name || t('pins.formModal.category')}
                                className="bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-2xl px-4 py-2.5 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-btn-primary/50 w-full"
                            />
                            {categorySearch && (
                                <div className="absolute z-10 w-full mt-1 bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-2xl max-h-48 overflow-y-auto">
                                    {categories?.filter(c =>
                                        c.name.toLowerCase().includes(categorySearch.toLowerCase())
                                    ).map((category) => (
                                        <button
                                            key={category.id}
                                            type="button"
                                            onClick={() => {
                                                setCategoryId(category.id);
                                                setCategorySearch("");
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white/80 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors"
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Опис"
                    rows={4}
                    className="w-full mt-4 bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-2xl px-4 py-2.5 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-btn-primary/50 resize-none"
                />

                <div className="mt-4">
                    <div className="relative">
                        <input
                            value={tagSearch}
                            onChange={(event) => setTagSearch(event.target.value)}
                            placeholder={t('pins.formModal.addTag')}
                            className="w-full bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-2xl px-4 py-2.5 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-btn-primary/50"
                        />
                        {tagSearch && (
                            <div className="absolute z-10 w-full mt-1 bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-2xl max-h-48 overflow-y-auto">
                                {availableTags.filter(tag =>
                                    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
                                ).map((tag) => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => {
                                            setTagIds((prev) => [...prev, tag.id]);
                                            setTagSearch("");
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white/80 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors"
                                    >
                                        #{tag.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
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
                    <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-2xl bg-gray-200 dark:bg-white/8 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/15 transition-colors">
                        {t('pins.formModal.cancel')}
                    </button>
                    <button type="submit" disabled={isLoading} className="flex-1 py-2.5 rounded-2xl bg-btn-primary text-white disabled:opacity-50 transition-colors">
                        {t('pins.formModal.save')}
                    </button>
                </div>
            </form>
            {showCropper && (
                <ImageCropperModal
                    imageSrc={cropperImageSrc}
                    onCrop={handleCropComplete}
                    onClose={() => {
                        setShowCropper(false);
                        setCropperImageSrc("");
                    }}
                />
            )}
        </div>
    );
};

export default PinFormModal;
