import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ITagResponse } from "@/types/tag/responses/ITagReponse.ts";
import { useCreateTagMutation, useUpdateTagMutation } from "@/services/tagService.ts";
import {useToast} from "@/components/ui/Toast/UseToast.ts";

const tagSchema = z.object({
    name: z
        .string()
        .min(1, "Назва тегу обов'язкова")
        .max(50, "Назва не може перевищувати 50 символів"),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface TagFormModalProps {
    tag: ITagResponse | null;
    onClose: () => void;
}

const getErrorMessage = (err: unknown): string => {
    if (err && typeof err === "object" && "data" in err) {
        const data = (err as { data?: { message?: string } }).data;
        if (data?.message) return data.message;
    }
    return "Щось пішло не так. Спробуйте ще раз.";
};

const TagFormModal = ({ tag, onClose }: TagFormModalProps) => {
    const isEdit = !!tag;
    const { showToast } = useToast();

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
                showToast("Тег оновлено", "success");
            } else {
                const formData = new FormData();
                formData.append("Name", values.name);
                await createTag(formData).unwrap();
                showToast("Тег створено", "success");
            }
            onClose();
        } catch (err) {
            showToast(getErrorMessage(err), "error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-sm bg-[#161616] border border-white/8 rounded-3xl p-6">
                <h2 className="text-lg font-semibold mb-4">
                    {isEdit ? "Редагувати тег" : "Новий тег"}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <div>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="Назва тегу"
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
    );
};

export default TagFormModal;