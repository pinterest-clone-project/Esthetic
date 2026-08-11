import React, { useState } from "react";
import { useForgotPasswordMutation } from "@/services/accountService.ts";
import Button from "@/components/button/Button.tsx";
import logo from "@/assets/logo.png";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { parseError } from "@/hooks/useApiError.ts";
import { useTranslation } from "react-i18next";
import { useLoading } from "@/context/LoadingContext";

interface ForgotPasswordFormProps {
    onSuccess?: (email: string) => void;
    onBack?: () => void;
}

const ForgotPasswordForm = ({ onSuccess, onBack }: ForgotPasswordFormProps) => {
    const { t } = useTranslation('auth');
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [forgotPassword] = useForgotPasswordMutation();
    const { withLoading } = useLoading();

    const isFormValid = email.includes("@") && email.includes(".");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            await withLoading(() => forgotPassword({ email: email.trim() }).unwrap());
            onSuccess?.(email.trim());
        } catch (err) {
            const apiError = parseError(err as FetchBaseQueryError);
            setErrorMessage(apiError.detail ?? apiError.title);
        }
    };

    return (
        <div className="step-animate flex flex-col items-center px-4 sm:px-16">
            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3">
                <img src={logo} className="w-11 h-11" alt="" />
            </div>

            <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px]">
                {t('forgotPassword.title')}
            </h2>
            <p className="text-sm text-white dark:text-black mb-5 text-center max-w-[320px]">
                {t('forgotPassword.subtitle')}
            </p>

            <form className="w-full space-y-3" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">{t('forgotPassword.emailLabel')}</label>
                    <input
                        type="email"
                        placeholder={t('forgotPassword.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none transition border-[var(--color-btn-primary)] border"
                    />
                </div>

                {errorMessage && (
                    <p className="text-red-500 text-xs">{errorMessage}</p>
                )}

                <Button
                    type="submit"
                    disabled={!isFormValid}
                    variant={isFormValid ? "primary" : "secondary"}
                    fullWidth
                    radius={5}
                >
                    {t('forgotPassword.sendCode')}
                </Button>
            </form>

            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className="text-xs text-[var(--color-text-muted)] mt-4 hover:text-[var(--color-btn-primary)] transition-colors cursor-pointer"
                >
                    {t('forgotPassword.backToLogin')}
                </button>
            )}
        </div>
    );
};

export default ForgotPasswordForm;
