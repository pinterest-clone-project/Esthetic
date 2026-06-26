import React, { useEffect, useState } from "react";
import { useResetPasswordMutation } from "@/services/accountService.ts";
import Button from "@/components/button/Button.tsx";
import logo from "@/assets/logo.png";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { parseError } from "@/hooks/useApiError.ts";

interface ResetPasswordFormProps {
    email?: string;
    onSuccess?: () => void;
    onBack?: () => void;
}

const ResetPasswordForm = ({ email: initialEmail = "", onSuccess, onBack }: ResetPasswordFormProps) => {
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    useEffect(() => {
        if (initialEmail) setEmail(initialEmail);
    }, [initialEmail]);

    const hasMinLength = password.length >= 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    const isFormValid =
        email.includes("@") &&
        email.includes(".") &&
        code.trim().length === 6 &&
        hasMinLength &&
        hasSymbol &&
        hasNumber;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        try {
            await resetPassword({
                email: email.trim(),
                code: code.trim(),
                newPassword: password,
            }).unwrap();
            setSuccess(true);
            setTimeout(() => onSuccess?.(), 1500);
        } catch (err) {
            const apiError = parseError(err as FetchBaseQueryError);
            setErrorMessage(apiError.detail ?? apiError.title);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center py-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3">
                    <img src={logo} className="w-11 h-11" alt="" />
                </div>
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
            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3">
                <img src={logo} className="w-11 h-11" alt="" />
            </div>

            <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px]">
                Reset password
            </h2>
            <p className="text-sm text-white dark:text-black mb-5 text-center max-w-[320px]">
                Enter the code from your email and choose a new password
            </p>

            <form className="w-full space-y-3" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="yourgmail@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        readOnly={!!initialEmail}
                        className="w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none transition border-[var(--color-btn-primary)] border"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">Confirmation code</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        placeholder="123456"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        required
                        className="w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none transition border-[var(--color-btn-primary)] border tracking-[0.3em]"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">New password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="your new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                </div>

                {errorMessage && (
                    <p className="text-red-500 text-xs">{errorMessage}</p>
                )}

                <Button
                    type="submit"
                    disabled={isLoading || !isFormValid}
                    variant={isFormValid ? "primary" : "secondary"}
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

export default ResetPasswordForm;
