import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {useEditProfileMutation, useGetMeQuery} from "@/services/accountService.ts";
import {useApiError} from "@/hooks/useApiError.ts";
import {useFormServerErrors} from "@/hooks/useFormServerErrors.ts";
import type {IEditRequest} from "@/types/account/requests/IEditRequest.ts";

const schema = z.object({
    firstName:   z.string().min(1, "Імʼя обовʼязкове").max(50).or(z.literal("")).optional(),
    lastName:    z.string().min(1, "Прізвище обовʼязкове").max(50).or(z.literal("")).optional(),
    email:       z.string().email("Невірний формат email").or(z.literal("")).optional(),
    bio:         z.string().max(500, "Максимум 500 символів").or(z.literal("")).optional(),
    phoneNumber: z
        .string()
        .regex(/^\+?[0-9\s\-()]{7,20}$/, "Невірний формат телефону")
        .or(z.literal(""))
        .optional(),
    gender:      z.number().optional(),
    birthDate:   z.string().optional(),
    isPrivate:   z.boolean().optional(),
    imageFile:   z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof schema>;

const ProfilePage = () => {
    const { data: me, isLoading } = useGetMeQuery();
    const [editProfile, { isLoading: isSaving, error: rawError }] = useEditProfileMutation();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        formState: { errors },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    // Парсимо помилку
    const apiError = useApiError(rawError as FetchBaseQueryError | undefined);

    // Підставляємо серверні помилки у поля форми
    useFormServerErrors(apiError, setError);

    useEffect(() => {
    if (!me) return;
    reset({
        firstName:   me.firstName   ?? "",
        lastName:    me.lastName    ?? "",
        email:       me.email       ?? "",
        bio:         me.bio         ?? "",
        phoneNumber: me.phoneNumber ?? "",
        gender:      me.gender      ?? undefined,
        birthDate:   me.birthDate   ? me.birthDate.slice(0, 10) : "",
        isPrivate:   me.isPrivate   ?? false,
    });
}, [me, reset]);

const onSubmit = async (formValues: FormValues) => {
    const patch: IEditRequest = {};

    const compareStr = (key: keyof IEditRequest, current: string | null | undefined) => {
        const val = formValues[key as keyof FormValues] as string | undefined;
        const orig = current ?? "";
        if (val === orig) return;
        (patch as Record<string, unknown>)[key] = val === "" ? null : val;
    };

    compareStr("firstName",   me?.firstName);
    compareStr("lastName",    me?.lastName);
    compareStr("email",       me?.email);
    compareStr("bio",         me?.bio);
    compareStr("phoneNumber", me?.phoneNumber);
    compareStr("birthDate",   me?.birthDate?.slice(0, 10));

    if (formValues.gender    !== me?.gender)    patch.gender    = formValues.gender;
    if (formValues.isPrivate !== me?.isPrivate) patch.isPrivate = formValues.isPrivate;
    if (formValues.imageFile instanceof File)   patch.imageFile = formValues.imageFile;

    if (Object.keys(patch).length === 0) return;

    await editProfile(patch as Record<string, unknown>);
};

if (isLoading) return <p>Завантаження...</p>;

return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
        <div>
            <input {...register("firstName")} placeholder="Імʼя" />
            {errors.firstName && <span>{errors.firstName.message}</span>}
        </div>

        <div>
            <input {...register("lastName")} placeholder="Прізвище" />
            {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>

        <div>
            <input {...register("email")} type="email" placeholder="Email" />
            {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div>
            <textarea {...register("bio")} placeholder="Про себе" />
            {errors.bio && <span>{errors.bio.message}</span>}
        </div>

        <div>
            <input {...register("phoneNumber")} placeholder="+380..." />
            {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
        </div>

        <div>
            <select {...register("gender", { valueAsNumber: true })}>
                <option value="">— Стать —</option>
                <option value={0}>Чоловіча</option>
                <option value={1}>Жіноча</option>
                <option value={2}>Інша</option>
            </select>
        </div>

        <div>
            <input {...register("birthDate")} type="date" />
        </div>

        <label>
            <input {...register("isPrivate")} type="checkbox" />
            Приватний акаунт
        </label>

        <div>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setValue("imageFile", e.target.files?.[0])}
            />
        </div>

        {/* Загальна помилка (не валідаційна — 401, 500 тощо) */}
        {apiError && !apiError.errors && (
            <p style={{ color: "red" }}>{apiError.detail ?? apiError.title}</p>
        )}

        <button type="submit" disabled={isSaving}>
            {isSaving ? "Збереження..." : "Зберегти"}
        </button>
    </form>
);
};

export default ProfilePage;