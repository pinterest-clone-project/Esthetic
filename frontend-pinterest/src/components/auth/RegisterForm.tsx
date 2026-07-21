import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ImageCropperModal from "@/components/ui/ImageCropperModal.tsx";
import { useGoogleLogin } from "@react-oauth/google";
import {useGoogleLoginMutation, useRegisterMutation} from "@/services/accountService.ts";
import { useAppDispatch } from "@/store";
import {setUser} from "@/store/slices/authSlice.ts";
import Button from "@/components/button/Button.tsx";
import GoogleIcon from "@/assets/icons/GoogleIcon.tsx";
import logo from "@/assets/logo.png";
import {StepIndicator} from "@/components/ui/StepIndicator.tsx";
import {useGetAllCategoriesQuery} from "@/services/categoryService.ts";
import { useRegisterFormStore, type FormData } from "@/store/slices/registerFormStore.tsx";
import {APP_ENV} from "@/constants/env";
import BirthDatePicker from "@/components/ui/BirthDatePicker.tsx";
import ComboboxInput from "@/components/ui/ComboboxInput.tsx";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getData as getCountries } from "country-list";
import { LANGUAGES } from "@/constants/languages.ts";

const COUNTRY_NAMES = getCountries()
    .map((c) => c.name)
    .filter((name) => name !== "Russian Federation (the)");

interface RegisterFormProps {
    onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const { t } = useTranslation('auth');
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [cropperSrc, setCropperSrc] = useState<string | null>(null);

    const { step, formData, imagePreview, setStep, updateField, setImagePreview, reset } =
        useRegisterFormStore();

    const genderMap: Record<"Male" | "Female" | "Other", number> = {
        Male: 0,
        Female: 1,
        Other: 2,
    };

    const dispatch = useAppDispatch();
    const [register, { isLoading }] = useRegisterMutation();
    const [loginByGoogle] = useGoogleLoginMutation();

    const hasMinLength = formData.password.length >= 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);

    const isStep1Valid =
        formData.email.includes("@") &&
        formData.email.includes(".") &&
        hasMinLength &&
        hasSymbol &&
        hasNumber &&
        formData.birthDate.trim().length > 0;

    const isStep2Valid =
        formData.firstName.trim().length > 0 &&
        formData.lastName.trim().length > 0 &&
        formData.username.trim().length >= 3 &&
        formData.username.trim().length <= 20 &&
        /^[a-zA-Z0-9_]+$/.test(formData.username.trim());

    const isStep4Valid =
        formData.country.trim().length > 0 && formData.language.trim().length > 0;

    const toggleCategory = (id: string) => {
        const next = formData.categoryIds.includes(id)
            ? formData.categoryIds.filter((c) => c !== id)
            : [...formData.categoryIds, id];
        updateField("categoryIds", next);
    };

    const { data: categories } = useGetAllCategoriesQuery();

    const [imageError, setImageError] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const unsupported = ["image/heic", "image/heif", "image/avif", "image/tiff"];
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (unsupported.includes(file.type) || ext === "heic" || ext === "heif") {
            setImageError("HEIC/HEIF format is not supported. Please use JPG, PNG or WebP.");
            e.target.value = "";
            return;
        }

        setImageError(null);
        setCropperSrc(URL.createObjectURL(file));
        e.target.value = "";
    };


    const [registerError, setRegisterError] = useState<string | null>(null);

    const handleSubmit = async () => {
        setRegisterError(null);
        try {
            const account = await register({
                UserName: formData.username,
                FirstName: formData.firstName,
                LastName: formData.lastName,
                Email: formData.email,
                Password: formData.password,
                BirthDate: formData.birthDate,
                Bio: formData.bio || undefined,
                PhoneNumber: formData.phoneNumber || undefined,
                Gender: formData.gender ? genderMap[formData.gender] : undefined,
                Country: formData.country || undefined,
                Language: formData.language || undefined,
                CategoryIds: formData.categoryIds,
                ImageFile: formData.imageFile || undefined,
                IsPrivate: formData.isPrivate,
            }).unwrap();
            dispatch(setUser(account));
            setStep(7);
            setTimeout(() => {
                onSuccess?.();
                reset();
            }, 2000);
        } catch (err: unknown) {
            const detail = (err as { data?: { detail?: string } })?.data?.detail;
            setRegisterError(detail ?? "Something went wrong. Please try again.");
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setIsGoogleLoading(true);
            try {
                const account = await loginByGoogle({ token: tokenResponse.access_token }).unwrap();
                dispatch(setUser(account));
                onSuccess?.();
            } catch (err) {
                console.error("Google login failed", err);
            } finally {
                setIsGoogleLoading(false);
            }
        },
    });

    const update = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => updateField(field, e.target.value as never);


    return (
        <>
        <div className="flex flex-col items-center px-4 sm:px-16">

<div className="w-11 h-11 rounded-full flex items-center justify-center mb-3">
                <img src={logo} className="w-11 h-11" alt="Esthetic logo" />
            </div>

            {step > 1 && <StepIndicator step={step} totalSteps={7} />}

            <div key={step} className="step-animate w-full">

                {step === 1 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center leading-tight">
                            {t('register.welcome')}
                        </h2>
                        <p className="text-sm text-[var(--color-btn-primary)] font-medium tracking-widest uppercase mt-1 mb-5 text-center">
                            {t('register.whereStyleBegins')}
                        </p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.email')}</label>
                                <input
                                    type="email"
                                    placeholder={t('placeholders.email')}
                                    value={formData.email}
                                    onChange={update("email")}
                                    className={`w-full h-10 px-4 rounded-[5px] text-sm outline-none text-white dark:text-black border-[var(--color-btn-primary)] transition border`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.password')}</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('placeholders.password')}
                                        value={formData.password}
                                        onChange={update("password")}
                                        className={`w-full h-10 px-4 pr-10 rounded-[5px] text-white dark:text-black text-sm outline-none border-[var(--color-btn-primary)] transition border`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] hover:text-black transition"
                                    >
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                                                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                                                <line x1="1" y1="1" x2="23" y2="23"/>
                                            </svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                <div className="mt-2 space-y-1">
                                    {[
                                        { label: t('register.passwordMin'), valid: hasMinLength },
                                        { label: t('register.passwordSymbol'), valid: hasSymbol },
                                        { label: t('register.passwordNumber'), valid: hasNumber },
                                    ].map(({ label, valid }) => (
                                        <div key={label} className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded-full border-2 transition-colors flex items-center justify-center ${
                                                valid
                                                    ? "border-[var(--color-btn-primary)] bg-[var(--color-btn-primary)]"
                                                    : "border-[#A1A1A1]"
                                            }`}>
                                                {valid && (
                                                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                        <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className="text-xs text-white dark:text-black">{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.birthDate')}</label>
                                <BirthDatePicker
                                    value={formData.birthDate}
                                    onChange={(val) => updateField("birthDate", val)}
                                />
                            </div>

                            <Button
                                type="button"
                                disabled={!isStep1Valid}
                                variant={isStep1Valid ? "primary" : "secondary"}
                                fullWidth
                                radius={5}
                                onClick={() => setStep(2)}
                            >
                                {t('actions.continue', { ns: 'common' })}
                            </Button>

                            <div className="flex items-center justify-center">
                                <span className="text-sm text-white dark:text-black text-[var(--color-text-dark)]">{t('register.or')}</span>
                            </div>

                            <Button
                                type="button"
                                disabled={isGoogleLoading}
                                variant="primary"
                                fullWidth
                                radius={5}
                                icon={<GoogleIcon />}
                                onClick={() => loginWithGoogle()}
                            >
                                {isGoogleLoading ? t('register.loading') : t('register.continueWithGoogle')}
                            </Button>
                        </div>

                        <p className="text-xs text-[var(--color-text-muted)] text-center mt-3 leading-5">
                            {t('register.terms')}
                        </p>
                    </div>
                )}

                {step === 2 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            {t('register.step2Title')}
                        </h2>
                        <p className="text-sm text-white dark:text-black mt-1 mb-5 text-center">{t('register.step2Sub')}</p>

                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm text-white dark:text-black mb-1">{t('fields.firstName')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('placeholders.firstName')}
                                        value={formData.firstName}
                                        onChange={update("firstName")}
                                        className={`w-full h-10 px-4 rounded-[5px] text-sm text-white dark:text-black outline-none border-[var(--color-btn-primary)] transition border`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-white dark:text-black text-sm mb-1">{t('fields.lastName')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('placeholders.lastName')}
                                        value={formData.lastName}
                                        onChange={update("lastName")}
                                        className={`w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none border-[var(--color-btn-primary)] transition border`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.username')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] text-sm">@</span>
                                    <input
                                        type="text"
                                        placeholder={t('placeholders.username')}
                                        value={formData.username}
                                        onChange={update("username")}
                                        className={`w-full h-10 pl-7 pr-4 rounded-[5px] text-white dark:text-black text-sm outline-none border-[var(--color-btn-primary)] transition border`}
                                    />
                                </div>
                                {formData.username.length > 0 && formData.username.length < 3 && (
                                    <p className="text-xs text-red-400 mt-1">{t('validation.usernameMin')}</p>
                                )}
                                {formData.username.length > 20 && (
                                    <p className="text-xs text-red-400 mt-1">{t('validation.usernameMax')}</p>
                                )}
                                {formData.username.length >= 3 && formData.username.length <= 20 && !/^[a-zA-Z0-9_]+$/.test(formData.username) && (
                                    <p className="text-xs text-red-400 mt-1">{t('validation.usernameChars')}</p>
                                )}
                                {(!formData.username || (formData.username.length >= 3 && formData.username.length <= 20 && /^[a-zA-Z0-9_]+$/.test(formData.username))) && (
                                    <p className="text-xs text-[#A1A1A1] mt-1">{t('validation.usernameFormat')}</p>
                                )}
                            </div>

                            <Button
                                type="button"
                                disabled={!isStep2Valid}
                                variant={isStep2Valid ? "primary" : "secondary"}
                                fullWidth
                                radius={5}
                                onClick={() => setStep(3)}
                            >
                                {t('actions.continue', { ns: 'common' })}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-center text-sm text-[#A1A1A1] dark:hover:text-black hover:text-white transition mt-1"
                            >
                                {t('register.back')}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            {t('register.step3Title')}
                        </h2>
                        <p className="text-sm text-white dark:text-black mt-1 mb-5 text-center">
                            {t('register.step3Sub')}
                        </p>

                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="primary"
                                fullWidth
                                radius={5}
                                onClick={() => {
                                    updateField("gender", "Male");
                                    setStep(4);
                                }}
                            >
                                {t('register.male')}
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                fullWidth
                                radius={5}
                                style={{ backgroundColor: "#535353" }}
                                onClick={() => {
                                    updateField("gender", "Female");
                                    setStep(4);
                                }}
                            >
                                {t('register.female')}
                            </Button>

                            <button
                                type="button"
                                onClick={() => { updateField("gender", "Other"); setStep(4); }}
                                className="w-full text-center text-xs text-[#A1A1A1] hover:text-white dark:hover:text-black transition"
                            >
                                {t('register.other')}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full text-center text-sm text-[#A1A1A1] hover:text-white dark:hover:text-black transition mt-1"
                            >
                                {t('register.back')}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            {t('register.step4Title')}
                        </h2>
                        <p className="text-sm text-white dark:text-black mt-1 mb-5 text-center">
                            {t('register.step4Sub')}
                        </p>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.country')}</label>
                                <ComboboxInput
                                    value={formData.country}
                                    onChange={(val) => updateField("country", val)}
                                    options={COUNTRY_NAMES}
                                    placeholder={t('placeholders.country')}
                                    className="text-white dark:text-black"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.language')}</label>
                                <ComboboxInput
                                    value={formData.language}
                                    onChange={(val) => updateField("language", val)}
                                    options={LANGUAGES}
                                    placeholder={t('placeholders.language')}
                                    className="text-white dark:text-black"
                                />
                            </div>

                            <Button
                                type="button"
                                disabled={!isStep4Valid}
                                variant={isStep4Valid ? "primary" : "secondary"}
                                fullWidth
                                radius={5}
                                onClick={() => setStep(5)}
                            >
                                {t('actions.continue', { ns: 'common' })}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="w-full text-center text-sm text-[#A1A1A1] hover:text-white dark:hover:text-black transition mt-1"
                            >
                                {t('register.back')}
                            </button>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            {t('register.step5Title')}
                        </h2>
                        <p className="text-sm text-white dark:text-black mt-1 mb-5 text-center">
                            {t('register.step5Sub')}
                        </p>

                        <div className="space-y-3">
                            <div className="flex flex-col items-center mb-2">
                                <label className="cursor-pointer group relative">
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-[var(--color-btn-primary)] group-hover:border-[var(--color-btn-primary)] transition flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Profile preview" />
                                        ) : (
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="1.5">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                <circle cx="12" cy="7" r="4"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-[var(--color-btn-primary)] rounded-full flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
                                            <path d="M12 5v14M5 12h14"/>
                                        </svg>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                                <p className="text-xs text-white dark:text-black text-[#A1A1A1] mt-2">{t('register.uploadPhoto')}</p>
                                {imageError && (
                                    <p className="text-xs text-red-400 mt-1 text-center">{imageError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.bio')}</label>
                                <textarea
                                    placeholder={t('placeholders.bio')}
                                    value={formData.bio}
                                    onChange={update("bio")}
                                    rows={3}
                                    maxLength={150}
                                    className="w-full px-4 py-2 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)] resize-none"
                                />
                                <p className="text-xs dark:text-[#A1A1A1] text-white text-right">{formData.bio.length}/150</p>
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.phoneNumber', 'Phone number')}</label>
                                <PhoneInput
                                    international
                                    defaultCountry="UA"
                                    value={formData.phoneNumber}
                                    onChange={(val) => updateField("phoneNumber", val ?? "")}
                                    className="phone-input"
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPrivate}
                                    onChange={(e) => updateField("isPrivate", e.target.checked)}
                                    className="accent-[#1DB954] w-4 h-4"
                                />
                                <span className="text-sm text-white dark:text-[#A1A1A1]">{t('register.privateAccount')}</span>
                            </label>

                            <Button
                                type="button"
                                disabled={false}
                                variant="primary"
                                fullWidth
                                radius={5}
                                onClick={() => setStep(6)}
                            >
                                {t('actions.continue', { ns: 'common' })}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(4)}
                                className="w-full text-center text-sm text-[#A1A1A1] hover:text-white dark:hover:text-black transition mt-1"
                            >
                                {t('register.back')}
                            </button>
                        </div>
                    </div>
                )}

                {step === 6 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            {t('register.step6Title')}
                        </h2>

                        <div className="grid grid-cols-4 gap-3 mt-5">
                            {categories?.map((category) => {
                                const isSelected = formData.categoryIds.includes(category.id);
                                return (
                                    <button
                                        key={category.id}
                                        type="button"
                                        onClick={() => toggleCategory(category.id)}
                                        className="flex flex-col items-center gap-1.5"
                                    >
                                        <div
                                            className={`relative w-full aspect-square rounded-[14px] overflow-hidden border-2 transition ${
                                                isSelected ? "border-[var(--color-btn-primary)]" : "border-transparent"
                                            }`}
                                        >
                                            <img
                                                src={`${APP_ENV.IMAGES_100_URL}${category.image}`}
                                                className="w-full h-full object-cover"
                                            />
                                            {isSelected && (
                                                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[var(--color-btn-primary)] flex items-center justify-center">
                                                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                                        <path d="M1 3L3 5L7 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-xs text-white dark:text-black">{category.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {registerError && (
                            <p className="text-red-400 text-sm text-center mt-4">{registerError}</p>
                        )}

                        <Button
                            type="button"
                            disabled={formData.categoryIds.length < 3 || isLoading}
                            variant={formData.categoryIds.length >= 3 ? "primary" : "secondary"}
                            fullWidth
                            radius={5}
                            onClick={handleSubmit}
                            className="mt-5"
                        >
                            {isLoading
                                ? t('register.creatingAccount')
                                : formData.categoryIds.length >= 3
                                    ? t('actions.continue', { ns: 'common' })
                                    : t('register.selectMore', { count: 3 - formData.categoryIds.length })}
                        </Button>

                        <button
                            type="button"
                            onClick={() => setStep(5)}
                            className="w-full text-center text-sm text-[#A1A1A1] hover:text-white dark:hover:text-black transition mt-2"
                        >
                            ← Back
                        </button>
                    </div>
                )}

                {step === 7 && (
                    <div className="w-full flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center max-w-[280px]">
                            {t('register.step7Title')}
                        </h2>
                    </div>
                )}

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
                    updateField("imageFile", croppedFile);
                    setImagePreview(URL.createObjectURL(croppedFile));
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

export default RegisterForm;