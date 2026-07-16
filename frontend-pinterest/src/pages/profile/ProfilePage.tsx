import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import ImageCropperModal from "@/components/ui/ImageCropperModal.tsx";
import BirthDatePicker from "@/components/ui/BirthDatePicker.tsx";
import ComboboxInput from "@/components/ui/ComboboxInput.tsx";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getData as getCountries } from "country-list";
import { LANGUAGES } from "@/constants/languages.ts";

const COUNTRY_NAMES = getCountries()
    .map((c) => c.name)
    .filter((name) => name !== "Russian Federation (the)");


const schema = z.object({
    firstName:   z.string().min(1, "Імʼя обовʼязкове").max(50).or(z.literal("")).optional(),
    lastName:    z.string().min(1, "Прізвище обовʼязкове").max(50).or(z.literal("")).optional(),
    userName:    z.string().min(3, "Мінімум 3 символи").max(20, "Максимум 20 символів").regex(/^[a-zA-Z0-9_]+$/, "Лише латинські літери, цифри та _").or(z.literal("")).optional(),
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
    const [cropperSrc, setCropperSrc] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        setError,
        watch,
        control,
        formState: { errors },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const { data: categories } = useGetAllCategoriesQuery();
    const selectedCategoryIds = watch("categoryIds") ?? [];
    const watchedFirstName = watch("firstName") ?? me?.firstName ?? "";
    const watchedLastName = watch("lastName") ?? me?.lastName ?? "";
    const watchedUserName = watch("userName") ?? me?.userName ?? "";
    const watchedBio = watch("bio") ?? me?.bio ?? "";
    const watchedImageFile = watch("imageFile");

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    useEffect(() => {
        if (watchedImageFile instanceof File) {
            const url = URL.createObjectURL(watchedImageFile);
            setAvatarPreview(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setAvatarPreview(null);
        }
    }, [watchedImageFile]);

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
            userName:    me.userName    ?? "",
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
    compareStr("userName",    me?.userName);
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
        showToast("Profile updated successfully", "success");
    } catch {
        showToast("Failed to update profile", "error");
    }
};

if (isLoading) return <p>Завантаження...</p>;

    return (
        <>
        <div className="flex justify-center py-4 sm:py-8 px-3 sm:px-6">
            <div className="flex flex-col w-full max-w-5xl">
            <div className="flex flex-col md:flex-row gap-6 w-full">

<aside className="md:w-[280px] md:self-start">
    <div className="border border-[#A1A1A1] dark:border-[#333] rounded-2xl p-6 flex flex-col items-center gap-4 text-black dark:text-white">

        {/* Avatar with upload */}
        <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-[#2a2a2a] border-2 border-[#1DB954] overflow-hidden">
                {avatarPreview || me?.image
                    ? <img src={avatarPreview ?? `${APP_ENV.IMAGES_800_URL}${me!.image}`} className="w-full h-full object-cover" alt="avatar" />
                    : <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1DB954" strokeWidth="1.5" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                }
            </div>
            <label className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const ext = file.name.split(".").pop()?.toLowerCase();
                    const unsupported = ["image/heic", "image/heif", "image/avif", "image/tiff"];
                    if (unsupported.includes(file.type) || ext === "heic" || ext === "heif") {
                        setAvatarError("HEIC/HEIF format is not supported. Please use JPG, PNG or WebP.");
                        e.target.value = "";
                        return;
                    }
                    setAvatarError(null);
                    setCropperSrc(URL.createObjectURL(file));
                    e.target.value = "";
                }} />
            </label>
        </div>

        {avatarError && (
            <p className="text-xs text-red-400 text-center -mt-2">{avatarError}</p>
        )}

        {/* Name */}
        <div className="text-center w-full">
            <p className="font-bold text-lg leading-tight break-words whitespace-normal">
                {[watchedFirstName, watchedLastName].filter(Boolean).join(" ") || "Your Name"}
            </p>
            {watchedUserName && (
                <p className="text-[#A1A1A1] text-sm mt-0.5 break-all">@{watchedUserName}</p>
            )}
        </div>

        {/* Bio preview */}
        {watchedBio && (
            <p className="text-sm text-[#A1A1A1] text-center line-clamp-2 break-words whitespace-normal">{watchedBio}</p>
        )}

        {/* Stats */}
        <div className="w-full border-t border-[#333] pt-4 flex flex-col gap-2">
            {me?.createdAt && (
                <div className="flex items-center gap-2 text-sm text-[#A1A1A1]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>Joined {new Date(me.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                </div>
            )}
            {me?.country && (
                <div className="flex items-center gap-2 text-sm text-[#A1A1A1]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    <span>{me.country}</span>
                </div>
            )}
            {me?.language && (
                <div className="flex items-center gap-2 text-sm text-[#A1A1A1]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span>{me.language}</span>
                </div>
            )}
        </div>

        {/* Interests */}
        {selectedCategoryIds.length > 0 && (
            <div className="w-full border-t border-[#333] pt-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-[#A1A1A1]">Interests</span>
                    <button
                        type="button"
                        onClick={() => setIsEditingInterests((prev) => !prev)}
                        className="text-xs text-[#1DB954] hover:underline"
                    >
                        {isEditingInterests ? "Done" : "Edit"}
                    </button>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full">
                    {(isEditingInterests ? categories : categories?.filter((c) => selectedCategoryIds.includes(c.id)))
                        ?.map((category) => {
                            const isSelected = selectedCategoryIds.includes(category.id);
                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => toggleCategory(category.id)}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className={`relative w-full aspect-square rounded-[10px] overflow-hidden border-2 transition ${
                                        isSelected ? "border-[#1DB954]" : "border-transparent"
                                    }`}>
                                        <img src={`${APP_ENV.IMAGES_1200_URL}${category.image}`} className="w-full h-full object-cover" alt={category.name} />
                                        {isEditingInterests && isSelected && (
                                            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#1DB954] flex items-center justify-center">
                                                <svg width="7" height="5" viewBox="0 0 8 6" fill="none">
                                                    <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[9px] text-[#A1A1A1] text-center leading-tight">{category.name}</span>
                                </button>
                            );
                        })}
                </div>
                {isEditingInterests && (
                    <p className="text-[10px] text-[#A1A1A1] mt-2 text-center">Click to toggle interests</p>
                )}
            </div>
        )}

        {selectedCategoryIds.length === 0 && (
            <div className="w-full border-t border-[#333] pt-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#A1A1A1]">Interests</span>
                    <button
                        type="button"
                        onClick={() => setIsEditingInterests(true)}
                        className="text-xs text-[#1DB954] hover:underline"
                    >
                        Add
                    </button>
                </div>
                {isEditingInterests && (
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {categories?.map((category) => {
                            const isSelected = selectedCategoryIds.includes(category.id);
                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    onClick={() => toggleCategory(category.id)}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className={`relative w-full aspect-square rounded-[10px] overflow-hidden border-2 transition ${
                                        isSelected ? "border-[#1DB954]" : "border-transparent"
                                    }`}>
                                        <img src={`${APP_ENV.IMAGES_1200_URL}${category.image}`} className="w-full h-full object-cover" alt={category.name} />
                                    </div>
                                    <span className="text-[9px] text-[#A1A1A1] text-center leading-tight">{category.name}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
                {!isEditingInterests && (
                    <p className="text-sm text-[#A1A1A1]">No interests selected yet.</p>
                )}
            </div>
        )}
    </div>
</aside>
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 text-black dark:text-white">

                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Edit your profile</h1>
                    <p className="text-[#A1A1A1] text-sm mt-1">Your info is visible to users who can view your profile</p>
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
                    <label className="text-xs text-[#A1A1A1] mb-1.5 block">Username</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A1A1] text-base select-none">@</span>
                        <input {...register("userName")} placeholder="your_username"
                               className="w-full bg-transparent border border-[#A1A1A1] dark:border-[#333] rounded-xl pl-8 pr-4 py-3 text-black dark:text-white placeholder-[#555] text-base focus:outline-none focus:border-[#1DB954] transition" />
                    </div>
                    {errors.userName && <span className="text-red-400 text-xs mt-1 block">{errors.userName.message}</span>}
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
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <PhoneInput
                                    international
                                    defaultCountry="UA"
                                    value={field.value ?? ""}
                                    onChange={(val) => field.onChange(val ?? "")}
                                    className="phone-input profile-phone-input !border-[#A1A1A1] dark:!border-[#333] !rounded-xl !px-4 !h-[50px]"
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Country</label>
                        <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                                <ComboboxInput
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    options={COUNTRY_NAMES}
                                    placeholder="Ukraine"
                                    className="text-black dark:text-white !border-[#A1A1A1] dark:!border-[#333] !rounded-xl !h-auto !px-4 !py-3 !text-base"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Language</label>
                        <Controller
                            name="language"
                            control={control}
                            render={({ field }) => (
                                <ComboboxInput
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    options={LANGUAGES}
                                    placeholder="Ukrainian"
                                    className="text-black dark:text-white !border-[#A1A1A1] dark:!border-[#333] !rounded-xl !h-auto !px-4 !py-3 !text-base"
                                />
                            )}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Gender</label>
                        <select {...register("gender", { valueAsNumber: true })}
                                className="w-full bg-white dark:bg-[#1a1a1a] border border-[#A1A1A1] dark:border-[#333] rounded-xl px-4 py-3 text-black dark:text-white text-base focus:outline-none focus:border-[#1DB954] transition">
                            <option value="">— Gender —</option>
                            <option value={0}>Female</option>
                            <option value={1}>Male</option>
                            <option value={2}>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-[#A1A1A1] mb-1.5 block">Birth date</label>
                        <Controller
                            name="birthDate"
                            control={control}
                            render={({ field }) => (
                                <BirthDatePicker
                                    value={field.value ?? ""}
                                    onChange={field.onChange}
                                    className="text-black dark:text-white border-[#A1A1A1] dark:border-[#333] rounded-xl h-[50px]"
                                />
                            )}
                        />
                    </div>
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
                    onClick={() => navigate("/deleted-auras")}
                    className="md:hidden mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 text-sm font-medium hover:border-gray-400 transition"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                    Recently deleted
                </button>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="md:hidden mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-500 text-red-500 text-sm font-medium hover:bg-red-500/10 transition"
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
            </div>
        </div>

        {cropperSrc && (
            <ImageCropperModal
                imageSrc={cropperSrc}
                defaultWidth={500}
                defaultHeight={500}
                onCrop={(croppedFile) => {
                    URL.revokeObjectURL(cropperSrc);
                    setCropperSrc(null);
                    setValue("imageFile", croppedFile);
                }}
                onClose={() => {
                    URL.revokeObjectURL(cropperSrc);
                    setCropperSrc(null);
                }}
            />
        )}
        </>
    );
};

export default ProfilePage;