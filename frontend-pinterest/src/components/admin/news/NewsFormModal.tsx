import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateNewsMutation, useUpdateNewsMutation } from "@/services/newsService.ts";
import { useLoading } from "@/context/LoadingContext";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import type { INews } from "@/types/news/INews.ts";
import { APP_ENV } from "@/constants/env";
import ImageCropperModal from "@/components/ui/ImageCropperModal.tsx";
import { Editor } from "@tinymce/tinymce-react";
import type { Theme } from "@/context/ThemeContext.tsx";

const TAGS = [
    "Product Update",
    "Community",
    "Design",
    "Engineering",
    "For Business",
    "Partnership",
];

type NewsFormValues = {
    titleUk: string;
    titleEn: string;
    excerptUk: string;
    excerptEn: string;
    tag: string;
    publishedAt: string;
    isFeatured: boolean;
    content?: string;
};

interface NewsFormModalProps {
    news: INews | null;
    onClose: () => void;
    theme: Theme;
}

const getApiErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "";
};

const toDateInputValue = (iso: string) => iso.split("T")[0];

const NewsFormModal = ({ news, onClose, theme }: NewsFormModalProps) => {
    const { t } = useTranslation('admin');
    const isEdit = !!news;
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageFile = useRef<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        news?.image ? `${APP_ENV.IMAGES_400_URL}${news.image}` : null
    );
    const [cropperSrc, setCropperSrc] = useState<string | null>(null);

    const schema = useMemo(() => z.object({
        titleUk: z.string().min(1, t('news.formModal.required')).max(120, t('news.formModal.maxTitle')),
        titleEn: z.string().min(1, t('news.formModal.required')).max(120, t('news.formModal.maxTitle')),
        excerptUk: z.string().min(1, t('news.formModal.required')).max(500, t('news.formModal.maxExcerpt')),
        excerptEn: z.string().min(1, t('news.formModal.required')).max(500, t('news.formModal.maxExcerpt')),
        tag: z.string().min(1, t('news.formModal.required')),
        publishedAt: z.string().min(1, t('news.formModal.required')),
        isFeatured: z.boolean(),
        content: z.string().optional(),
    }), [t]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<NewsFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            titleUk: news?.titleUk ?? "",
            titleEn: news?.titleEn ?? "",
            excerptUk: news?.excerptUk ?? "",
            excerptEn: news?.excerptEn ?? "",
            tag: news?.tag ?? TAGS[0],
            publishedAt: news ? toDateInputValue(news.publishedAt) : toDateInputValue(new Date().toISOString()),
            isFeatured: news?.isFeatured ?? false,
            content: news?.content ?? "",
        },
    });

    const [createNews] = useCreateNewsMutation();
    const [updateNews] = useUpdateNewsMutation();
    const { withLoading } = useLoading();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setCropperSrc(url);
        e.target.value = "";
    };

    const handleCrop = (file: File) => {
        imageFile.current = file;
        const url = URL.createObjectURL(file);
        setImagePreview(prev => {
            if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
            return url;
        });
    };

    const onSubmit = async (values: NewsFormValues) => {
        if (!isEdit && !imageFile.current) {
            showToast(t('news.imageMissing'), "error");
            return;
        }
        try {
            await withLoading(async () => {
                if (isEdit) {
                    await updateNews({
                        id: news.id,
                        ...values,
                        ...(imageFile.current ? { imageFile: imageFile.current } : {}),
                    }).unwrap();
                    showToast(t('toast.newsUpdated'), "success");
                } else {
                    await createNews({
                        ...values,
                        imageFile: imageFile.current!,
                    }).unwrap();
                    showToast(t('toast.newsCreated'), "success");
                }
            });
            onClose();
        } catch (err) {
            showToast(getApiErrorMessage(err) || t('news.formModal.error'), "error");
        }
    };

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
            <div className="w-full max-w-4xl bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-white/8 rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {isEdit ? t('news.edit') : t('news.new')}
                    </h2>
                    <button type="button" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-white/50">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                    {/* Two columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left column */}
                        <div className="flex flex-col gap-3">
                            {/* Image */}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-200 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/10 flex items-center justify-center hover:border-[#1DB954]/50 transition-colors"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-white/30">
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                                        <span className="text-xs">{t('news.formModal.photo')}</span>
                                    </div>
                                )}
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                            {/* Titles */}
                            <div>
                                <input {...register("titleUk")} placeholder={t('news.formModal.titleUk')}
                                    className="w-full bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-[#1DB954]/50 transition-colors" />
                                {errors.titleUk && <p className="text-xs text-red-500 mt-1">{errors.titleUk.message}</p>}
                            </div>
                            <div>
                                <input {...register("titleEn")} placeholder={t('news.formModal.titleEn')}
                                    className="w-full bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-[#1DB954]/50 transition-colors" />
                                {errors.titleEn && <p className="text-xs text-red-500 mt-1">{errors.titleEn.message}</p>}
                            </div>

                            {/* Tag + Date */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <select {...register("tag")}
                                        className="w-full bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-[#1DB954]/50 transition-colors">
                                        {TAGS.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <input {...register("publishedAt")} type="date"
                                        className="w-full bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-[#1DB954]/50 transition-colors [color-scheme:light] dark:[color-scheme:dark]" />
                                </div>
                            </div>

                            {/* Featured */}
                            <label className="flex items-center justify-between px-1 py-2 rounded-xl bg-gray-200 dark:bg-white/5 cursor-pointer">
                                <span className="text-sm text-gray-700 dark:text-white/70">{t('news.formModal.isFeatured')}</span>
                                <input {...register("isFeatured")} type="checkbox" className="w-4 h-4 accent-[#1DB954]" />
                            </label>
                        </div>

                        {/* Right column — excerpts */}
                        <div className="flex flex-col gap-3">
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">{t('news.formModal.excerptUk')}</label>
                                <textarea {...register("excerptUk")} rows={5}
                                    className="w-full bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-[#1DB954]/50 transition-colors resize-none" />
                                {errors.excerptUk && <p className="text-xs text-red-500 mt-1">{errors.excerptUk.message}</p>}
                            </div>
                            <div className="flex-1">
                                <label className="text-xs text-gray-500 dark:text-white/40 mb-1 block">{t('news.formModal.excerptEn')}</label>
                                <textarea {...register("excerptEn")} rows={5}
                                    className="w-full bg-gray-200 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/8 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-white/80 outline-none focus:border-[#1DB954]/50 transition-colors resize-none" />
                                {errors.excerptEn && <p className="text-xs text-red-500 mt-1">{errors.excerptEn.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Content editor — full width */}
                    <div>
                        <label className="text-xs text-gray-500 dark:text-white/40 mb-2 block">{t('news.formModal.content')}</label>
                        <Editor
                            apiKey="6d380nx6s5ebnl6gwubl451w6ugoces1tb0t8yixr286f9kb"
                            init={{
                                height: 280,
                                menubar: false,
                                plugins: 'link image code lists table media help wordcount',
                                toolbar: 'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
                                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }',
                                skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
                                content_css: theme === 'dark' ? 'dark' : 'default',
                                background_color: theme === 'dark' ? '#1a1a1a' : '#ffffff',
                            }}
                            initialValue={news?.content ?? ""}
                            onEditorChange={(content: string) => setValue('content', content)}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 rounded-2xl bg-gray-200 dark:bg-white/8 text-gray-700 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/15 text-sm transition-colors">
                            {t('news.formModal.cancel')}
                        </button>
                        <button type="submit" disabled={isSubmitting}
                            className="flex-1 py-2.5 rounded-2xl bg-[#1DB954] text-white text-sm disabled:opacity-50 hover:opacity-90 transition-opacity">
                            {isEdit ? t('news.formModal.save') : t('news.formModal.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        {cropperSrc && (
            <ImageCropperModal
                imageSrc={cropperSrc}
                onCrop={handleCrop}
                onClose={() => {
                    URL.revokeObjectURL(cropperSrc);
                    setCropperSrc(null);
                }}
                defaultWidth={1200}
                defaultHeight={675}
            />
        )}
        </>
    );
};

export default NewsFormModal;
