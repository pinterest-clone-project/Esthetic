import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "@/services/categoryService.ts";
import { toSlug } from "@/utils/slugify.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";
import type { ICategory } from "@/types/categories/ICategory.ts";
import ImageCropperModal from "@/components/ui/ImageCropperModal.tsx";
import {APP_ENV} from "@/constants/env";

const categorySchema = z.object({
    name: z.string().min(1, "Назва обов'язкова").max(60, "Максимум 60 символів"),
    description: z.string().max(300, "Максимум 300 символів").optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormModalProps {
    category: ICategory | null;
    onClose: () => void;
}

const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "Щось пішло не так. Спробуйте ще раз.";
};

const getCategoryImageUrl = (image: string): string => `${APP_ENV.IMAGES_200_URL}${image}`;

const CategoryFormModal = ({ category, onClose }: CategoryFormModalProps) => {
    const isEdit = !!category;
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: {
            name: category?.name ?? "",
            description: category?.description ?? "",
        },
    });

    const nameValue = watch("name");
    const slug = toSlug(nameValue || "");

    const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        category?.image ? getCategoryImageUrl(category.image) : null
    );

    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setRawImageSrc(URL.createObjectURL(file));
        e.target.value = "";
    };

    const handleCropped = (file: File) => {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const onSubmit = async (values: CategoryFormValues) => {
        if (!isEdit && !imageFile) {
            showToast("Оберіть зображення для категорії", "error");
            return;
        }

        try {
            if (isEdit) {
                await updateCategory({
                    id: category.id,
                    name: values.name,
                    slug,
                    description: values.description ?? "",
                    ...(imageFile ? { imageFile } : {}),
                }).unwrap();
                showToast("Категорію оновлено", "success");
            } else {
                await createCategory({
                    name: values.name,
                    slug,
                    description: values.description ?? "",
                    imageFile: imageFile!,
                }).unwrap();
                showToast("Категорію створено", "success");
            }
            onClose();
        } catch (err) {
            showToast(getErrorMessage(err), "error");
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
                <div className="w-full max-w-md bg-[#161616] border border-white/8 rounded-3xl p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {isEdit ? "Редагувати категорію" : "Нова категорія"}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 rounded-2xl overflow-hidden bg-white/8 border border-white/8 flex items-center justify-center hover:border-btn-primary/50 transition-colors"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-xs text-white/40">Фото</span>
                                )}
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>

                        <div>
                            <input
                                {...register("name")}
                                type="text"
                                placeholder="Назва категорії"
                                className="w-full bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
                            />
                            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                        </div>

                        {slug && (
                            <p className="text-xs text-white/30 px-1">
                                Посилання: <span className="text-white/50">/{slug}</span>
                            </p>
                        )}

                        <div>
                            <textarea
                                {...register("description")}
                                placeholder="Опис (необов'язково)"
                                rows={3}
                                className="w-full bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors resize-none"
                            />
                            {errors.description && (
                                <p className="text-xs text-red-400 mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 rounded-2xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors"
                            >
                                Скасувати
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 py-2.5 rounded-2xl bg-btn-primary text-white disabled:opacity-50 transition-colors"
                            >
                                {isEdit ? "Зберегти" : "Створити"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {rawImageSrc && (
                <ImageCropperModal
                    imageSrc={rawImageSrc}
                    defaultWidth={800}
                    defaultHeight={600}
                    onCrop={handleCropped}
                    onClose={() => setRawImageSrc(null)}
                />
            )}
        </>
    );
};

export default CategoryFormModal;