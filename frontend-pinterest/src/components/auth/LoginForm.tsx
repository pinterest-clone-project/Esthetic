import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useLoginMutation } from "@/services/accountService.ts";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice.ts";
import Button from "@/components/button/Button.tsx";
import logo from "@/assets/logo.png";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
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
            navigate("/");
        } catch (err) {
            console.error("Login failed", err);
        }
    };


    return (
        <div className="flex flex-col items-center">

            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3">
                <img src={logo} className="w-11 h-11" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-black tracking-[-0.5px]">Welcome in Esthetic</h2>
            <p className="text-sm text-black  mb-5">Where style begins</p>

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

                </div>


                {error && <p className="text-red-500 text-xs">Невірний email або пароль</p>}

                <Button type="submit"
                        disabled={isLoading}
                        variant={isFormValid ? "primary" : "secondary"}
                        fullWidth
                        radius={5}>
                    Log In
                </Button>

            </form>

            <p className="text-xs text-[var(--color-text-muted)] text-center mt-3 leading-5">
                By continuing, you agree to the Esthetic Terms of Service and
                acknowledge that you have read our Privacy Policy. Notice.
            </p>
        </div>
    );
};

export default LoginForm;