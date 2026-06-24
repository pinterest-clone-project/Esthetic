import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {useGoogleLoginMutation, useRegisterMutation} from "@/services/accountService.ts";
import { useAppDispatch } from "@/store";
import {setUser} from "@/store/slices/authSlice.ts";
import Button from "@/components/button/Button.tsx";
import GoogleIcon from "@/assets/icons/GoogleIcon.tsx";
import logo from "@/assets/logo.png";

interface RegisterFormProps {
    onSuccess?: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;


interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    birthDate: string;
    bio: string;
    phoneNumber: string;
    gender: "Male" | "Female" | "Other" | null;
    imageFile: File | null;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState<Step>(1);
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        username: "",
        birthDate: "",
        bio: "",
        phoneNumber: "",
        imageFile: null,
        gender: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const [register, { isLoading }] = useRegisterMutation();
    const [loginByGoogle] = useGoogleLoginMutation();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);


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
        formData.username.trim().length >= 3;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFormData((prev) => ({ ...prev, imageFile: file }));
        setImagePreview(URL.createObjectURL(file));
    };


    const handleSubmit = async () => {
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
                Gender: formData.gender || undefined,
                ImageFile: formData.imageFile || undefined,
            }).unwrap();
            dispatch(setUser(account));
            setStep(5);
            setTimeout(() => {
                onSuccess?.();
            }, 2000);
        } catch (err) {
            console.error("Register failed", err);
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
    ) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

    const StepIndicator = () => (
        <div className="flex w-full gap-1 mb-6">
            {([1, 2, 3, 4 , 5] as Step[]).map((s) => (
                <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        s <= step
                            ? "bg-[var(--color-btn-primary)]"
                            : "bg-[#A1A1A1]"
                    }`}
                />
            ))}
        </div>
    );


    return (
        <div className="flex flex-col items-center px-16">

            <style>{`
        @keyframes stepFadeIn {
            0%   { opacity: 0; transform: translateX(12px); }
            100% { opacity: 1; transform: translateX(0); }
        }
        .step-animate {
            animation: stepFadeIn 0.3s ease-out forwards;
        }
        `}</style>

            <div className="w-11 h-11 rounded-full flex items-center justify-center mb-3">
                <img src={logo} className="w-11 h-11" />
            </div>

            {<StepIndicator />}

            <div key={step} className="step-animate w-full">

                {step === 1 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            Welcome to Esthetic
                        </h2>
                        <p className="text-sm text-white dark:text-black mt-1 mb-5 text-center">Where style begins</p>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">Your email</label>
                                <input
                                    type="email"
                                    placeholder="yourgmail@gmail.com"
                                    value={formData.email}
                                    onChange={update("email")}
                                    className={`w-full h-10 px-4 rounded-[5px] text-sm outline-none text-white dark:text-black border-[var(--color-btn-primary)] transition border`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="your password"
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
                                        { label: "8 characters minimum", valid: hasMinLength },
                                        { label: "a symbol", valid: hasSymbol },
                                        { label: "a number", valid: hasNumber },
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
                                <label className="block text-sm text-white dark:text-black mb-1">Date of birth</label>
                                <input
                                    type="date"
                                    value={formData.birthDate}
                                    onChange={update("birthDate")}
                                    max={new Date().toISOString().split("T")[0]}
                                    className={`date-picker w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none border-[var(--color-btn-primary)] transition border`}
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
                                Continue
                            </Button>

                            <div className="flex items-center justify-center">
                                <span className="text-sm text-white dark:text-black text-[var(--color-text-dark)]">Or</span>
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
                                {isGoogleLoading ? "Loading..." : "Continue with Google"}
                            </Button>
                        </div>

                        <p className="text-xs text-[var(--color-text-muted)] text-center mt-3 leading-5">
                            By continuing, you agree to the Esthetic Terms of Service and
                            acknowledge that you have read our Privacy Policy.
                        </p>
                    </div>
                )}

                {step === 2 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            Nice to meet you!
                        </h2>
                        <p className="text-sm text-white dark:text-black mt-1 mb-5 text-center">What's your name?</p>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">First name</label>
                                <input
                                    type="text"
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={update("firstName")}
                                    className={`w-full h-10 px-4 rounded-[5px] text-sm text-white dark:text-black outline-none border-[var(--color-btn-primary)] transition border`}
                                />
                            </div>

                            <div>
                                <label className="block text-white dark:text-black text-sm text-black mb-1">Last name</label>
                                <input
                                    type="text"
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={update("lastName")}
                                    className={`w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none border-[var(--color-btn-primary)] transition border`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">Username</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1A1] text-sm">@</span>
                                    <input
                                        type="text"
                                        placeholder="john_doe"
                                        value={formData.username}
                                        onChange={update("username")}
                                        className={`w-full h-10 pl-7 pr-4 rounded-[5px] text-white dark:text-black text-sm outline-none border-[var(--color-btn-primary)] transition border`}
                                    />
                                </div>
                                <p className="text-xs text-[#A1A1A1] mt-1">Minimum 3 characters</p>
                            </div>

                            <Button
                                type="button"
                                disabled={!isStep2Valid}
                                variant={isStep2Valid ? "primary" : "secondary"}
                                fullWidth
                                radius={5}
                                onClick={() => setStep(3)}
                            >
                                Continue
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-center text-sm text-[#A1A1A1] dark:hover:text-black hover:text-white transition mt-1"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            What is your gender?
                        </h2>
                        <p className="text-sm text-white dark:text-black mt-1 mb-5 text-center">
                            This information will always be private.
                        </p>

                        <div className="space-y-3">
                            <Button
                                type="button"
                                variant="primary"
                                fullWidth
                                radius={5}
                                onClick={() => {
                                    setFormData((prev) => ({ ...prev, gender: "Male" }));
                                    setStep(4);
                                }}
                            >
                                Male
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                fullWidth
                                radius={5}
                                onClick={() => {
                                    setFormData((prev) => ({ ...prev, gender: "Female" }));
                                    setStep(4);
                                }}
                            >
                                Female
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                fullWidth
                                radius={5}
                                onClick={() => {
                                    setFormData((prev) => ({ ...prev, gender: "Other" }));
                                    setStep(4);
                                }}
                            >
                                Other
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="w-full text-center text-sm text-[#A1A1A1] hover:text-white dark:hover:text-black transition mt-1"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="w-full">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center">
                            Almost done!
                        </h2>
                        <p className="text-sm text-white dark:text-black mt-1 mb-5 text-center">
                            Add a profile photo and tell us about yourself
                        </p>

                        <div className="space-y-3">
                            <div className="flex flex-col items-center mb-2">
                                <label className="cursor-pointer group relative">
                                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-[var(--color-btn-primary)] group-hover:border-[var(--color-btn-primary)] transition flex items-center justify-center overflow-hidden">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" />
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
                                <p className="text-xs text-white dark:text-black text-[#A1A1A1] mt-2">Upload photo (optional)</p>
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">Bio</label>
                                <textarea
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={update("bio")}
                                    rows={3}
                                    maxLength={150}
                                    className="w-full px-4 py-2 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)] resize-none"
                                />
                                <p className="text-xs dark:text-[#A1A1A1] text-white text-right">{formData.bio.length}/150</p>
                            </div>

                            <div>
                                <label className="block text-sm text-white dark:text-black mb-1">Phone number</label>
                                <input
                                    type="tel"
                                    placeholder="+380 xx xxx xx xx"
                                    value={formData.phoneNumber}
                                    onChange={update("phoneNumber")}
                                    className="w-full h-10 px-4 rounded-[5px] text-white dark:text-black text-sm outline-none transition border border-[var(--color-btn-primary)]"
                                />
                            </div>

                            <Button
                                type="button"
                                disabled={isLoading}
                                variant="primary"
                                fullWidth
                                radius={5}
                                onClick={handleSubmit}
                            >
                                {isLoading ? "Creating account..." : "Let's go!"}
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="w-full text-center text-sm text-[#A1A1A1] hover:text-white dark:hover:text-black transition mt-1"
                            >
                                ← Back
                            </button>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="w-full flex flex-col items-center">
                        <h2 className="text-2xl font-bold text-white dark:text-black tracking-[-0.5px] text-center max-w-[280px]">
                            Your account successfully created
                        </h2>
                    </div>
                )}

            </div>

        </div>
    );
};

export default RegisterForm;