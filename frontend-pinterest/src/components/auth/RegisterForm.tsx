import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useLoginMutation, useGoogleLoginMutation } from "@/services/accountService.ts";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice.ts";
import Button from "@/components/button/Button.tsx";
import GoogleIcon from "@/assets/icons/GoogleIcon.tsx";
import logo from "@/assets/logo.png";

const RegisterForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [login, { isLoading, error }] = useLoginMutation();
    const [loginByGoogle, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

    const hasMinLength = password.length >= 8;
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);

    const isFormValid = email.includes("@") && email.includes(".") && hasMinLength && hasSymbol && hasNumber;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const account = await login({ email, password }).unwrap();
            dispatch(setUser(account));
            navigate("/");
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const account = await loginByGoogle({ token: tokenResponse.access_token }).unwrap();
                dispatch(setUser(account));
                navigate("/");
            } catch (err) {
                console.error("Google login failed", err);
            }
        },
    });

    return (
        <div className="flex flex-col items-center">

            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3">
                <img src={logo} className="w-11 h-11" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-black tracking-[-0.5px]">Welcome in Esthetic</h2>
            <p className="text-sm text-black mt-1 mb-5">Where style begins</p>

            <form className="w-full space-y-3" onSubmit={handleSubmit}>

                <div>
                    <label className="block text-sm  text-black mb-1">Your gmail</label>
                    <input
                        type="email"
                        placeholder="yourgmail@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`w-full h-10 px-4 rounded-[5px] text-sm outline-none transition border ${
                            email.includes("@") && email.includes(".")
                                ? "border-[var(--color-btn-primary)]"
                                : "border-[#A1A1A1]"
                        }`}
                    />
                </div>


                <label className="block text-sm text-black mb-1">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`w-full h-10 px-4 pr-10 rounded-[5px] text-sm outline-none transition border ${
                            hasMinLength && hasSymbol && hasNumber
                                ? "border-[var(--color-btn-primary)]"
                                : "border-[#A1A1A1]"
                        }`}
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

                <div className="mt-1 space-y-1">
                    {[
                        { label: "8 characters minimum", valid: hasMinLength },
                        { label: "a symbol",             valid: hasSymbol },
                        { label: "a number",             valid: hasNumber },
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
                            <span className="text-xs text-[var(--color-text-muted)]">{label}</span>
                        </div>
                    ))}
                </div>


                <div>
                    <label className="block text-sm text-black mb-1">Date of birth</label>
                    <input
                        type="text"
                        placeholder="dd/mm/yy"
                        className="w-full h-10 px-4 rounded-[5px] border border-[#A1A1A1] text-sm outline-none focus:border-black transition"
                    />
                </div>

                {error && <p className="text-red-500 text-xs">Невірний email або пароль</p>}

                <Button type="submit"
                        disabled={isLoading}
                        variant={isFormValid ? "primary" : "secondary"}
                        fullWidth
                        radius={5}>
                    Continue
                </Button>

                <div className="flex items-center justify-center my-2">
                    <span className="text-sm text-[var(--color-text-dark)]">Or</span>
                </div>

                <Button
                    type="button"
                    disabled={isGoogleLoading}
                    variant="dark"
                    fullWidth
                    radius={5}
                    icon={<GoogleIcon />}
                    onClick={() => loginWithGoogle()}
                >
                    Continue with Google
                </Button>
            </form>

            <p className="text-xs text-[var(--color-text-muted)] text-center mt-3 leading-5">
                By continuing, you agree to the Esthetic Terms of Service and
                acknowledge that you have read our Privacy Policy. Notice.
            </p>
        </div>
    );
};

export default RegisterForm;