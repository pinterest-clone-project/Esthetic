import { useState, useMemo, useRef, useEffect } from "react";
import { useGetPinByIdQuery, useUpdatePinMutation } from "@/services/pinService.ts";
import { useGetAllCategoriesQuery } from "@/services/categoryService.ts";
import { useGetAllTagsQuery } from "@/services/tagService.ts";
import ImageCropperModal from "@/components/ui/ImageCropperModal.tsx";
import { APP_ENV } from "@/constants/env";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";

const EditAuraPage = () => {
    const { t } = useTranslation('pins');
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data: pin, isLoading: isPinLoading } = useGetPinByIdQuery(id!);
    const [updatePin, { isLoading }] = useUpdatePinMutation();
    const { data: categories } = useGetAllCategoriesQuery();
    const { data: tags } = useGetAllTagsQuery();

    const [cropperSrc, setCropperSrc] = useState<string | null>(null);
    const imageFile = useRef<File | null>(null);
    const [mediaUrl, setMediaUrl] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tagIds, setTagIds] = useState<string[]>([]);
    const [previewUrl, setPreviewUrl] = useState("");

    const [tagQuery, setTagQuery] = useState("");
    const [tagFocused, setTagFocused] = useState(false);
    const tagBoxRef = useRef<HTMLDivElement>(null);

    const [categoryOpen, setCategoryOpen] = useState(false);
    const categoryBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (pin) {
            setTitle(pin.title ?? "");
            setDescription(pin.description ?? "");
            setSourceUrl(pin.sourceUrl ?? "");
            setCategoryId(pin.categoryId ?? "");
            setTagIds(pin.tags.map(t => t.id));
            setPreviewUrl(pin.image ? `${APP_ENV.IMAGES_800_URL}${pin.image}` : "");
        }
    }, [pin]);

    const selectedTags = useMemo(
        () => tags?.filter(t => tagIds.includes(t.id)) ?? [],
        [tags, tagIds]
    );

    const suggestions = useMemo(() => {
        if (!tags) return [];
        const q = tagQuery.trim().toLowerCase();
        return tags
            .filter(t => !tagIds.includes(t.id))
            .filter(t => q === "" || t.name.toLowerCase().includes(q))
            .slice(0, 8);
    }, [tags, tagIds, tagQuery]);

    const selectedCategory = categories?.find(c => c.id === categoryId);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (tagBoxRef.current && !tagBoxRef.current.contains(e.target as Node)) {
                setTagFocused(false);
            }
            if (categoryBoxRef.current && !categoryBoxRef.current.contains(e.target as Node)) {
                setCategoryOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!previewUrl.startsWith("blob:")) return;
        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const objectUrl = URL.createObjectURL(file);
        setCropperSrc(objectUrl);
        e.target.value = "";
    };

    const handleCropDone = (croppedFile: File) => {
        if (cropperSrc) URL.revokeObjectURL(cropperSrc);
        setCropperSrc(null);
        imageFile.current = croppedFile;
        setMediaUrl("");
        setPreviewUrl(URL.createObjectURL(croppedFile));
    };

    const handleCropCancel = () => {
        if (cropperSrc) URL.revokeObjectURL(cropperSrc);
        setCropperSrc(null);
    };

    const handleMediaUrlBlur = () => {
        if (!mediaUrl.trim()) return;
        imageFile.current = null;
        setPreviewUrl(mediaUrl);
    };

    const addTag = (tagId: string) => {
        setTagIds(prev => [...prev, tagId]);
        setTagQuery("");
    };

    const removeTag = (tagId: string) => {
        setTagIds(prev => prev.filter(t => t !== tagId));
    };

    const handleSubmit = async () => {
        if (!id) return;
        try {
            await updatePin({
                id,
                title: title || undefined,
                description: description || undefined,
                sourceUrl: sourceUrl || undefined,
                categoryId: categoryId || undefined,
                tagIds: tagIds.length > 0 ? tagIds : undefined,
                imageFile: imageFile.current ?? undefined,
                mediaUrl: !imageFile.current && mediaUrl.trim() ? mediaUrl.trim() : undefined,
            }).unwrap();
            navigate(`/aura/preview/${id}`);
        } catch (e) {
            console.error(e);
        }
    };


    if (isPinLoading) {
        return (
            <div className="w-full min-h-full flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-[#4ade80] animate-spin" />
            </div>
        );
    }

    if (!pin) {
        return (
            <div className="w-full min-h-full flex items-center justify-center">
                <p className="text-red-400 text-sm">{t('edit.notFound')}</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full px-4 sm:px-10 py-8 flex flex-col items-center">
            <div className="flex items-center justify-between mb-8 w-full max-w-[580px]">
                <h1 className="text-black dark:text-white text-sm font-medium tracking-wide">{t('edit.title')}</h1>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-40 disabled:cursor-not-allowed
                        text-black text-xs font-semibold px-5 py-2 rounded-md transition-colors"
                >
                    {isLoading ? t('edit.saving') : t('edit.submit')}
                </button>
            </div>

            <div className="w-full max-w-[580px] flex flex-col gap-5">

                <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 sm:items-start">
                    <div className="flex sm:flex-col gap-4 sm:gap-2 sm:shrink-0">
                        <div className="w-[140px] sm:w-[200px] min-h-[140px] sm:min-h-[200px] rounded-2xl overflow-hidden bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] flex items-center justify-center shrink-0">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                            ) : (
                                <div className="flex flex-col items-center gap-2 p-6 text-center">
                                    <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span className="text-gray-600 text-xs">{t('imageActions.preview')}</span>
                                </div>
                            )}
                        </div>
                        <label className="text-black dark:text-white text-xs font-medium cursor-pointer sm:text-center self-end sm:self-auto">
                            <span className="inline-block px-3 py-1.5 rounded-md border border-gray-300 dark:border-[#333] hover:border-[#1DB954] transition-colors">
                                {t('imageActions.uploadImage')}
                            </span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-black dark:text-white text-xs font-medium">{t('fields.title')}</label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder={t('placeholders.auraName')}
                                className="w-full bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md px-3 h-9 text-black dark:text-white text-xs
                                    placeholder:text-gray-400 outline-none focus:border-[#1DB954] transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-black dark:text-white text-xs font-medium">{t('fields.imageUrl')}</label>
                            <input
                                type="text"
                                value={mediaUrl}
                                onChange={e => setMediaUrl(e.target.value)}
                                onBlur={handleMediaUrlBlur}
                                placeholder={t('placeholders.newImageLink')}
                                className="w-full bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md px-3 h-9 text-black dark:text-white text-xs
                                placeholder:text-gray-400 outline-none focus:border-[#1DB954] transition-colors"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-black dark:text-white text-xs font-medium">{t('fields.sourceLink')}</label>
                            <input
                                type="text"
                                value={sourceUrl}
                                onChange={e => setSourceUrl(e.target.value)}
                                placeholder={t('placeholders.sourceLink')}
                                className="w-full bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md px-3 h-9 text-black dark:text-white text-xs
                                    placeholder:text-gray-400 outline-none focus:border-[#1DB954] transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-5 sm:gap-10 sm:items-start">
                    <div className="sm:shrink-0 sm:w-[200px] flex flex-col gap-1.5 relative" ref={categoryBoxRef}>
                        <label className="text-black dark:text-white text-xs font-medium">{t('fields.category')}</label>
                        <button
                            type="button"
                            onClick={() => setCategoryOpen(p => !p)}
                            className="w-full bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md px-3 h-9 text-xs
                                outline-none focus:border-[#1DB954] transition-colors
                                flex items-center justify-between text-left
                                hover:border-[#4ade80]/50"
                        >
                            <span className={`flex items-center gap-2 truncate ${selectedCategory ? "text-black dark:text-white" : "text-gray-400"}`}>
                                {selectedCategory?.image && (
                                    <img src={`${APP_ENV.IMAGES_100_URL}${selectedCategory.image}`} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                                )}
                                {selectedCategory ? selectedCategory.name : t('placeholders.chooseCategory')}
                            </span>
                            <svg className={`w-3.5 h-3.5 text-gray-500 shrink-0 transition-transform ${categoryOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {categoryOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md shadow-2xl max-h-60 overflow-y-auto">
                                {categoryId && (
                                    <button
                                        type="button"
                                        onClick={() => { setCategoryId(""); setCategoryOpen(false); }}
                                        className="w-full text-left px-3 py-2 text-xs text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-[#333]"
                                    >
                                        {t('categoryActions.clearSelection')}
                                    </button>
                                )}
                                {categories?.map(cat => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => { setCategoryId(cat.id); setCategoryOpen(false); }}
                                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 transition-colors
                                            ${cat.id === categoryId ? "bg-[#4ade80]/10 text-[#4ade80]" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white"}`}
                                    >
                                        {cat.image ? (
                                            <img src={`${APP_ENV.IMAGES_100_URL}${cat.image}`} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                                        ) : (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 shrink-0" />
                                        )}
                                        <div className="flex flex-col min-w-0">
                                            <span className="truncate">{cat.name}</span>
                                            {cat.description && (
                                                <span className="text-[10px] text-gray-500 truncate">{cat.description}</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-1.5 relative" ref={tagBoxRef}>
                        <label className="text-black dark:text-white text-xs font-medium">{t('fields.tags')}</label>
                        <input
                            type="text"
                            value={tagQuery}
                            onChange={e => setTagQuery(e.target.value)}
                            onFocus={() => setTagFocused(true)}
                            placeholder={t('placeholders.searchTags')}
                            className="w-full bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md px-3 h-9 text-black dark:text-white text-xs
                                placeholder:text-gray-400 outline-none focus:border-[#1DB954] transition-colors"
                        />
                        {tagFocused && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md shadow-2xl max-h-48 overflow-y-auto">
                                {suggestions.map(tag => (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => addTag(tag.id)}
                                        className="w-full text-left px-3 py-2 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        #{tag.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        {tagFocused && tagQuery && suggestions.length === 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md shadow-2xl px-3 py-2">
                                <span className="text-xs text-gray-400">{t('categoryActions.noMatchingTags')}</span>
                            </div>
                        )}
                        {selectedTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-1">
                                {selectedTags.map(tag => (
                                    <span
                                        key={tag.id}
                                        className="text-xs px-2.5 py-1 rounded-full bg-[#4ade80] text-black flex items-center gap-1.5"
                                    >
                                        #{tag.name}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag.id)}
                                            className="hover:opacity-60 transition-opacity"
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-black dark:text-white text-xs font-medium">{t('fields.description')}</label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder={t('placeholders.auraDescription')}
                        rows={8}
                        className="bg-gray-100 dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-md px-3 py-2.5 text-black dark:text-white text-xs
                            placeholder:text-gray-400 outline-none focus:border-[#1DB954] transition-colors resize-none"
                    />
                </div>
            </div>
            {cropperSrc && (
                <ImageCropperModal
                    imageSrc={cropperSrc}
                    onCrop={handleCropDone}
                    onClose={handleCropCancel}
                />
            )}
        </div>
    );
};

export default EditAuraPage;
