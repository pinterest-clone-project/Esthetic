import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ITagResponse } from "@/types/tag/responses/ITagReponse.ts";
import { useCreateTagMutation, useUpdateTagMutation } from "@/services/tagService.ts";
import { useToast } from "@/components/ui/Toast/UseToast.ts";

type TagFormValues = {
    name: string;
};

interface TagFormModalProps {
    tag: ITagResponse | null;
    onClose: () => void;
}

const getApiErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "";
};

const TagFormModal = ({ tag, onClose }: TagFormModalProps) => {
    const { t } = useTranslation('admin');
    const isEdit = !!tag;
    const { showToast } = useToast();

    const tagSchema = useMemo(() => z.object({
        name: z.string()
            .min(1, t('tags.formModal.required'))
            .max(50, t('tags.formModal.maxLength')),
    }), [t]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TagFormValues>({
        resolver: zodResolver(tagSchema),
        defaultValues: { name: tag?.name ?? "" },
    });

    const [createTag] = useCreateTagMutation();
    const [updateTag] = useUpdateTagMutation();

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const onSubmit = async (values: TagFormValues) => {
        try {
            if (isEdit) {
                await updateTag({ id: tag.id, name: values.name }).unwrap();
                showToast(t('toast.tagUpdated'), "success");
            } else {
                const formData = new FormData();
                formData.append("Name", values.name);
                await createTag(formData).unwrap();
                showToast(t('toast.tagCreated'), "success");
            }
            onClose();
        } catch (err) {
            showToast(getApiErrorMessage(err) || t('tags.formModal.error'), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm bg-[#161616] border border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                    {isEdit ? t('tags.edit') : t('tags.new')}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder={t('tags.name')}
                            className="w-full bg-[#1a1a1a] border border-white/8 rounded-2xl px-4 py-2.5 text-sm text-white/80 outline-none focus:border-btn-primary/50 transition-colors"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-2xl bg-white/8 text-white/70 hover:bg-white/15 transition-colors"
                        >
                            {t('tags.formModal.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 rounded-2xl bg-btn-primary text-white disabled:opacity-50 transition-colors"
                        >
                            {isEdit ? t('tags.formModal.save') : t('tags.formModal.create')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TagFormModal;
