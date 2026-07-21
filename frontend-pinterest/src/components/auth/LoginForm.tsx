import React, { useState } from "react";
import { useLoginMutation } from "@/services/accountService.ts";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice.ts";
import Button from "@/components/button/Button.tsx";
import logo from "@/assets/logo.png";
import { useTranslation } from "react-i18next";


interface LoginFormProps {
    onSuccess?: () => void;
    onForgotPassword?: () => void;
}

const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
    const { t } = useTranslation('auth');
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useAppDispatch();

    const [login, { isLoading, error }] = useLoginMutation();

    const hasMinLength = password.length >= 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    const isFormValid = email.includes("@") && email.includes(".") && hasMinLength && hasSymbol && hasNumber;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const account = await login({ email, password }).unwrap();
            dispatch(setUser(account));
            onSuccess?.();
        } catch (err) {
            console.error("Login failed", err);
        }
    };


    return (
        <div className="flex flex-col items-center px-4 sm:px-16">

            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3">
                <img src={logo} className="w-11 h-11" alt="Esthetic logo" />
            </div>


            <div className="step-animate w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center leading-tight">
                {t('login.welcome')}
            </h2>
            <p className="text-sm text-[var(--color-btn-primary)] font-medium tracking-widest uppercase mt-1 mb-5 text-center">
                {t('login.whereStyleBegins')}
            </p>

            <form className="w-full space-y-3" onSubmit={handleSubmit}>

                <div>
                    <label className="block text-sm text-white dark:text-black mb-1">{t('fields.email')}</label>
                    <input
                        type="email"
                        placeholder={t('placeholders.email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none transition border-[var(--color-btn-primary)] border`}
                    />
                </div>

                <label className="block text-sm text-white dark:text-black mb-1">{t('fields.password')}</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={t('placeholders.password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`w-full h-10 px-4 pr-10 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)]`}
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

                {onForgotPassword && (
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-btn-primary)] transition-colors cursor-pointer"
                    >
                        {t('login.forgotPassword')}
                    </button>
                )}

                {error && <p className="text-red-500 text-xs">{t('login.invalidCredentials')}</p>}

                <Button type="submit"
                        disabled={isLoading}
                        variant={isFormValid ? "primary" : "secondary"}
                        fullWidth
                        radius={5}>
                    {t('login.submit')}
                </Button>

            </form>

            <p className="text-xs text-[var(--color-text-muted)] text-center mt-3 leading-5">
                {t('login.terms')}
            </p>
            </div>
        </div>
    );
};

export default LoginForm;