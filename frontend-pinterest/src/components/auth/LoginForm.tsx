import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useLoginMutation, useGoogleLoginMutation } from "@/services/accountService.ts";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice.ts";
import Button from "@/components/button/Button.tsx";
import GoogleIcon from "@/asssets/icons/GoogleIcon.tsx";
import logo from "@/assets/logo.png";

const LoginForm = () => {
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

            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4">
                <img src={logo} className="w-11 h-11" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-black tracking-[-0.5px]">Welcome in Esthetic</h2>
            <p className="text-sm text-black mt-1 mb-6">Where style begins</p>

            <form className="w-full space-y-4" onSubmit={handleSubmit}>

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


                <div>
                    <label className="block text-sm text-black mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={`w-full h-10 px-4 rounded-[5px] text-sm outline-none transition border ${
                            hasMinLength && hasSymbol && hasNumber
                                ? "border-[var(--color-btn-primary)]"
                                : "border-[#A1A1A1]"
                        }`}
                    />


                    <div className="mt-2 space-y-1">
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

            <p className="text-xs text-[var(--color-text-muted)] text-center mt-4 leading-5">
                By continuing, you agree to the Esthetic Terms of Service and
                acknowledge that you have read our Privacy Policy. Notice.
            </p>
        </div>
    );
};

export default LoginForm;