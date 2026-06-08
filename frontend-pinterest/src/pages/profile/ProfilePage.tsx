import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {useEditProfileMutation, useGetMeQuery} from "@/services/accountService.ts";
import {useApiError} from "@/hooks/useApiError.ts";
import {useFormServerErrors} from "@/hooks/useFormServerErrors.ts";
import type {IEditRequest} from "@/types/account/requests/IEditRequest.ts";
import {APP_ENV} from "@/constants/env";

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
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[480px] p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Edit your profile</h1>
            <p className="text-text-muted text-sm mb-6">
                Keep your personal information private. The information you add here is visible to all users who can view your profile.
            </p>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-[#2a2a2a] border-2 border-btn-primary flex items-center justify-center overflow-hidden">
                    {me?.image
                        ? <img src={`${APP_ENV.IMAGES_100_URL}${me.image}`} className="w-full h-full object-cover" />
                        : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    }
                </div>
                <label className="px-5 py-2 rounded-lg bg-[#2a2a2a] text-white text-sm cursor-pointer hover:bg-[#3a3a3a] transition">
                    Edit
                    <input type="file" accept="image/*" className="hidden"
                           onChange={(e) => setValue("imageFile", e.target.files?.[0])} />
                </label>
            </div>


            {[
                { name: "firstName" as const, placeholder: "John" },
                { name: "lastName"  as const, placeholder: "Your surname" },
                { name: "bio"       as const, placeholder: "About you", textarea: true },
                { name: "email"     as const, placeholder: "Email" },
                { name: "phoneNumber" as const, placeholder: "+380..." },
            ].map(({ name, placeholder, textarea }) => (
                <div key={name} className="mb-3">
                    {textarea
                        ? <textarea {...register(name)} placeholder={placeholder} rows={3}
                                    className="w-full bg-transparent border border-[#333] rounded-lg px-4 py-3 text-white placeholder-text-muted text-sm focus:outline-none focus:border-btn-primary resize-none transition" />
                        : <input {...register(name)} placeholder={placeholder}
                                 className="w-full bg-transparent border border-[#333] rounded-lg px-4 py-3 text-white placeholder-text-muted text-sm focus:outline-none focus:border-btn-primary transition" />
                    }
                    {errors[name] && <span className="text-red-400 text-xs mt-1">{errors[name]?.message}</span>}
                </div>
            ))}

            {/* Gender */}
            <div className="mb-3">
                <select {...register("gender", { valueAsNumber: true })}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-btn-primary transition">
                    <option value="">— Gender —</option>
                    <option value={0}>Male</option>
                    <option value={1}>Female</option>
                    <option value={2}>Other</option>
                </select>
            </div>

            {/* Birth date */}
            <div className="mb-3">
                <input {...register("birthDate")} type="date"
                       className="w-full bg-transparent border border-[#333] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-btn-primary transition" />
            </div>

            {/* Private */}
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
                <input {...register("isPrivate")} type="checkbox" className="accent-btn-primary w-4 h-4" />
                <span className="text-sm text-text-muted">Private account</span>
            </label>

            {apiError && !apiError.errors && (
                <p className="text-red-400 text-sm mb-4">{apiError.detail ?? apiError.title}</p>
            )}

            <button type="submit" disabled={isSaving}
                    className="w-full py-3 rounded-lg bg-btn-primary text-black font-medium text-sm hover:opacity-90 disabled:opacity-50 transition">
                {isSaving ? "Saving..." : "Save"}
            </button>
        </form>
);
};

export default ProfilePage;