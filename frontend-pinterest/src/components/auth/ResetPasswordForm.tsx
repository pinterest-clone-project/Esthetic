import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPasswordMutation } from "@/services/accountService.ts";
import Button from "@/components/button/Button.tsx";
import logo from "@/assets/logo.png";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { parseError } from "@/hooks/useApiError.ts";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeOffIcon } from "@/components/ui/Icons.tsx";
import { useLoading } from "@/context/LoadingContext";

type FormValues = {
    email: string;
    code: string;
    password: string;
};

interface ResetPasswordFormProps {
    email?: string;
    onSuccess?: () => void;
    onBack?: () => void;
}

const ResetPasswordForm = ({ email: initialEmail = "", onSuccess, onBack }: ResetPasswordFormProps) => {
    const { t } = useTranslation('auth');
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [resetPassword] = useResetPasswordMutation();
    const { withLoading } = useLoading();

    const schema = z.object({
        email: z
            .string()
            .min(1, t('validation.emailRequired'))
            .email(t('validation.emailInvalid')),
        code: z
            .string()
            .length(6, t('resetPassword.validation.codeLength'))
            .regex(/^\d{6}$/, t('resetPassword.validation.codeDigits')),
        password: z
            .string()
            .min(8, t('validation.passwordMin'))
            .regex(/[!@#$%^&*(),.?":{}|<>]/, t('validation.passwordSpecial'))
            .regex(/\d/, t('validation.passwordDigit')),
    });

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: initialEmail, code: "", password: "" },
    });

    useEffect(() => {
        if (initialEmail) setValue("email", initialEmail);
    }, [initialEmail, setValue]);

    const password = watch("password", "");
    const hasMinLength = password.length >= 8;
    const hasSymbol    = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber    = /\d/.test(password);

    const onSubmit = async (values: FormValues) => {
        setServerError(null);
        try {
            await withLoading(() => resetPassword({
                email:       values.email,
                code:        values.code,
                newPassword: values.password,
            }).unwrap());
            setSuccess(true);
            setTimeout(() => onSuccess?.(), 1500);
        } catch (err) {
            const apiError = parseError(err as FetchBaseQueryError);
            setServerError(apiError.detail ?? apiError.title);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center py-4">
                <img src={logo} className="w-11 h-11 mb-3" alt="" />
                <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] mb-2">
                    {t('resetPassword.successTitle')}
                </h2>
                <p className="text-sm text-white dark:text-black text-center">
                    {t('resetPassword.successDesc')}
                </p>
            </div>
        );
    }

    return (
        <div className="step-animate flex flex-col items-center px-4 sm:px-16">
            <img src={logo} className="w-11 h-11 mb-3" alt="" />

            <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px]">
                {t('resetPassword.title')}
            </h2>
            <p className="text-sm text-white dark:text-black mb-5 text-center max-w-[320px]">
                {t('resetPassword.subtitle')}
            </p>

            <form className="w-full space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">{t('fields.email')}</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder={t('placeholders.email')}
                        readOnly={!!initialEmail}
                        className="w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)]"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">{t('resetPassword.codeLabel')}</label>
                    <input
                        {...register("code")}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "");
                            setValue("code", digits, { shouldValidate: true });
                        }}
                        className="w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)] tracking-[0.3em]"
                    />
                    {errors.code && (
                        <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">{t('resetPassword.newPasswordLabel')}</label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder={t('resetPassword.newPasswordPlaceholder')}
                            className="w-full h-10 px-4 pr-10 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] hover:text-white dark:hover:text-black transition cursor-pointer"
                        >
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        </button>
                    </div>

                    {password.length > 0 && (
                        <ul className="mt-1.5 space-y-0.5">
                            <PasswordHint ok={hasMinLength} label={t('resetPassword.hints.minLength')} />
                            <PasswordHint ok={hasNumber}    label={t('resetPassword.hints.digit')} />
                            <PasswordHint ok={hasSymbol}    label={t('resetPassword.hints.symbol')} />
                        </ul>
                    )}

                    {errors.password && !password.length && (
                        <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                </div>

                {serverError && (
                    <p className="text-red-500 text-xs">{serverError}</p>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    radius={5}
                >
                    {t('resetPassword.submit')}
                </Button>
            </form>

            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="text-xs text-[var(--color-text-muted)] mt-4 hover:text-[var(--color-btn-primary)] transition-colors cursor-pointer"
                >
                    {t('resetPassword.back')}
                </button>
            )}
        </div>
    );
};

const PasswordHint = ({ ok, label }: { ok: boolean; label: string }) => (
    <li className={`flex items-center gap-1.5 text-xs transition-colors ${ok ? "text-[#1DB954]" : "text-[#A1A1A1]"}`}>
        <span>{ok ? "✓" : "○"}</span>
        {label}
    </li>
);

export default ResetPasswordForm;
