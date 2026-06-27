import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useResetPasswordMutation } from "@/services/accountService.ts";
import Button from "@/components/button/Button.tsx";
import logo from "@/assets/logo.png";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { parseError } from "@/hooks/useApiError.ts";

const schema = z.object({
    email: z
        .string()
        .min(1, "Email обов'язковий")
        .email("Введіть коректний email"),
    code: z
        .string()
        .length(6, "Код підтвердження — рівно 6 цифр")
        .regex(/^\d{6}$/, "Код має містити лише цифри"),
    password: z
        .string()
        .min(8, "Мінімум 8 символів")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Потрібен хоча б один спецсимвол")
        .regex(/\d/, "Потрібна хоча б одна цифра"),
});

type FormValues = z.infer<typeof schema>;

interface ResetPasswordFormProps {
    email?: string;
    onSuccess?: () => void;
    onBack?: () => void;
}

const ResetPasswordForm = ({ email: initialEmail = "", onSuccess, onBack }: ResetPasswordFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

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
            await resetPassword({
                email:       values.email,
                code:        values.code,
                newPassword: values.password,
            }).unwrap();
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
                    Password updated
                </h2>
                <p className="text-sm text-white dark:text-black text-center">
                    You can now log in with your new password
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center">
            <img src={logo} className="w-11 h-11 mb-3" alt="" />

            <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px]">
                Reset password
            </h2>
            <p className="text-sm text-white dark:text-black mb-5 text-center max-w-[320px]">
                Enter the code from your email and choose a new password
            </p>

            <form className="w-full space-y-3" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">Email</label>
                    <input
                        {...register("email")}
                        type="email"
                        placeholder="yourgmail@gmail.com"
                        readOnly={!!initialEmail}
                        className="w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)]"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">Confirmation code</label>
                    <input
                        {...register("code")}
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        onChange={(e) => {
                            // дозволяємо лише цифри
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
                    <label className="block text-sm text-white dark:text-black mb-1">New password</label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="your new password"
                            className="w-full h-10 px-4 pr-10 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] hover:text-white dark:hover:text-black transition cursor-pointer"
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

                    {password.length > 0 && (
                        <ul className="mt-1.5 space-y-0.5">
                            <PasswordHint ok={hasMinLength} label="Мінімум 8 символів" />
                            <PasswordHint ok={hasNumber}    label="Хоча б одна цифра" />
                            <PasswordHint ok={hasSymbol}    label="Хоча б один спецсимвол (!@#...)" />
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
                    disabled={isLoading}
                    variant="primary"
                    fullWidth
                    radius={5}
                >
                    {isLoading ? "Saving..." : "Reset password"}
                </Button>
            </form>

            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="text-xs text-[var(--color-text-muted)] mt-4 hover:text-[var(--color-btn-primary)] transition-colors cursor-pointer"
                >
                    Back
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