import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {useEditProfileMutation, useGetMeQuery, useLogoutMutation} from "@/services/accountService.ts";
import {useApiError} from "@/hooks/useApiError.ts";
import {useFormServerErrors} from "@/hooks/useFormServerErrors.ts";
import type {IEditRequest} from "@/types/account/requests/IEditRequest.ts";
import {APP_ENV} from "@/constants/env";
import {useToast} from "@/components/ui/Toast/UseToast.ts";
import {useAppDispatch} from "@/store";
import {clearUser} from "@/store/slices/authSlice.ts";
import {api} from "@/services/api.ts";
import {useNavigate} from "react-router";
import { useGetAllCategoriesQuery } from "@/services/categoryService.ts";

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
    country:     z.string().max(100).or(z.literal("")).optional(),
    language:    z.string().max(50).or(z.literal("")).optional(),
    categoryIds: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

const ProfilePage = () => {
    const { data: me, isLoading } = useGetMeQuery();
    const [editProfile, { isLoading: isSaving, error: rawError }] = useEditProfileMutation();
    const { showToast } = useToast();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try { await logout(); } catch {}
        dispatch(clearUser());
        dispatch(api.util.resetApiState());
        navigate("/");
    };
    const [isEditingInterests, setIsEditingInterests] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const { data: categories } = useGetAllCategoriesQuery();
    const selectedCategoryIds = watch("categoryIds") ?? [];

    const toggleCategory = (id: string) => {
        const current = selectedCategoryIds;
        const next = current.includes(id)
            ? current.filter((c) => c !== id)
            : [...current, id];
        setValue("categoryIds", next, { shouldDirty: true });
    };

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
            country:     me.country     ?? "",
            language:    me.language    ?? "",
            categoryIds: me.categoryIds ?? [],
        });
    }, [me?.id]);

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
    compareStr("country",  me?.country);
    compareStr("language", me?.language);

    const currentCategoryIds = me?.categoryIds ?? [];
    const newCategoryIds = formValues.categoryIds ?? [];
    const categoriesChanged =
        currentCategoryIds.length !== newCategoryIds.length ||
        !currentCategoryIds.every((id) => newCategoryIds.includes(id));

    if (categoriesChanged) patch.categoryIds = newCategoryIds;

    if (formValues.gender    !== me?.gender)    patch.gender    = formValues.gender;
    if (formValues.isPrivate !== me?.isPrivate) patch.isPrivate = formValues.isPrivate;
    if (formValues.imageFile instanceof File)   patch.imageFile = formValues.imageFile;

    if (Object.keys(patch).length === 0) return;

    try {
        await editProfile(patch as Record<string, unknown>).unwrap();
        showToast("Профіль успішно оновлено", "success");
    } catch {
        showToast("Не вдалося оновити профіль", "error");
    }
};

if (isLoading) return <p>Завантаження...</p>;

    return (
        <div className="flex justify-center py-4 sm:py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[680px] px-3 sm:px-6 text-black dark:text-white">

                <div className="flex items-center gap-5 mb-8">
                    <div className="relative group cursor-pointer">
                        <div className="w-20 h-20 rounded-full bg-[#2a2a2a] border-2 border-[#1DB954] overflow-hidden">
                            {me?.image
                                ? <img src={`${APP_ENV.IMAGES_800_URL}${me.image}`} className="w-full h-full object-cover" />
                                : <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="1.5" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                            }
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => setValue("imageFile", e.target.files?.[0])} />
                        </label>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Edit your profile</h1>
                        <p className="text-[#A1A1A1] text-sm mt-1">Your info is visible to users who can view your profile</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">First name</label>
                        <input {...register("firstName")} placeholder="John"
                               className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white placeholder-[#555] text-base focus:outline-none focus:border-[#1DB954] transition" />
                        {errors.firstName && <span className="text-red-400 text-xs mt-1">{errors.firstName.message}</span>}
                    </div>
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Last name</label>
                        <input {...register("lastName")} placeholder="Doe"
                               className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white placeholder-[#555] text-base focus:outline-none focus:border-[#1DB954] transition" />
                        {errors.lastName && <span className="text-red-400 text-xs mt-1">{errors.lastName.message}</span>}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="text-xs text-[#A1A1A1] mb-1.5 block">About you</label>
                    <textarea {...register("bio")} placeholder="Tell something about yourself..." rows={3}
                              className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white placeholder-[#555] text-base focus:outline-none focus:border-[#1DB954] resize-none transition" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Email</label>
                        <input {...register("email")} placeholder="john@example.com"
                               className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white placeholder-[#555] text-base focus:outline-none focus:border-[#1DB954] transition" />
                        {errors.email && <span className="text-red-400 text-xs mt-1">{errors.email.message}</span>}
                    </div>
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Phone</label>
                        <input {...register("phoneNumber")} placeholder="+380..."
                               className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white placeholder-[#555] text-base focus:outline-none focus:border-[#1DB954] transition" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Country</label>
                        <input {...register("country")} placeholder="Ukraine"
                               className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white placeholder-[#555] text-base focus:outline-none focus:border-[#1DB954] transition" />
                    </div>
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Language</label>
                        <input {...register("language")} placeholder="Ukrainian"
                               className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white placeholder-[#555] text-base focus:outline-none focus:border-[#1DB954] transition" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Gender</label>
                        <select {...register("gender", { valueAsNumber: true })}
                                className="w-full bg-[#D1D1D1] dark:bg-[#1a1a1a] border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white text-sm focus:outline-none focus:border-[#1DB954] transition">
                            <option value="">— Gender —</option>
                            <option value={0}>Female</option>
                            <option value={1}>Male</option>
                            <option value={2}>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Birth date</label>
                        <input {...register("birthDate")} type="date"
                               className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white text-base focus:outline-none focus:border-[#1DB954] transition" />
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs text-[#A1A1A1]">Interests</label>
                        <button
                            type="button"
                            onClick={() => setIsEditingInterests((prev) => !prev)}
                            className="text-xs text-[#1DB954] hover:underline"
                        >
                            {isEditingInterests ? "Done" : "Edit"}
                        </button>
                    </div>

                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {(isEditingInterests
                                ? categories
                                : categories?.filter((category) => selectedCategoryIds.includes(category.id))
                        )?.map((category) => {
                            const isSelected = selectedCategoryIds.includes(category.id);
                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => toggleCategory(category.id)}
                                    className="flex flex-col items-center gap-1.5"
                                >
                                    <div
                                        className={`relative w-full aspect-square rounded-[14px] overflow-hidden border-2 transition ${
                                            isSelected ? "border-[#1DB954]" : "border-transparent"
                                        }`}
                                    >
                                        <img
                                            src={`${APP_ENV.IMAGES_100_URL}${category.image}`}
                                            className="w-full h-full object-cover"
                                        />
                                        {isEditingInterests && isSelected && (
                                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#1DB954] flex items-center justify-center">
                                                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                    <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] text-[#A1A1A1] text-center">{category.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {!isEditingInterests && selectedCategoryIds.length === 0 && (
                        <p className="text-sm text-[#A1A1A1] mt-2">You haven't selected any interests yet.</p>
                    )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input {...register("isPrivate")} type="checkbox" className="accent-[#1DB954] w-4 h-4" />
                        <span className="text-sm text-[#A1A1A1]">Private account</span>
                    </label>
                    <button type="submit" disabled={isSaving}
                            className="px-10 py-3 rounded-xl bg-[#1DB954] text-black font-semibold text-base hover:bg-[#1aa34a] disabled:opacity-50 transition">
                        {isSaving ? "Saving..." : "Save"}
                    </button>
                </div>

                {apiError && !apiError.errors && (
                    <p className="text-red-400 text-sm mt-4">{apiError.detail ?? apiError.title}</p>
                )}

                <button
                    type="button"
                    onClick={handleLogout}
                    className="md:hidden mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500 text-red-500 text-sm font-medium hover:bg-red-500/10 transition"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                </button>
            </form>
        </div>
    );
};

export default ProfilePage;