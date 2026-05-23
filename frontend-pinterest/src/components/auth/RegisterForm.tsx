///////////////////////////////////////////////
// ---------  This is just for testing --------
///////////////////////////////////////////////

import React, { useState } from "react";
import Button from "@/components/button/Button.tsx";
import GoogleIcon from "@/asssets/icons/GoogleIcon.tsx";

const CheckIcon = ({ checked }: { checked: boolean }) => (
    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors
        ${checked ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white'}`}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
    </div>
);

const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [birthDate, setBirthDate] = useState("");

    const hasMinLength = password.length >= 8;
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Logo */}
            <div className="flex flex-col items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-[#1a8a5a] flex items-center justify-center mb-3">
                    <span className="text-white font-serif text-lg font-bold italic">E</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Welcome in Esthetic</h2>
                <p className="text-sm text-gray-500 mt-0.5">Where style begins</p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-700">Your gmail</label>
                <input
                    type="email"
                    placeholder="yourgmail@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="h-11 px-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-gray-500 transition-colors placeholder:text-gray-400 w-full"
                />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 w-full">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                    type="password"
                    placeholder="your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="h-11 px-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-gray-500 transition-colors placeholder:text-gray-400 w-full"
                />
                <div className="flex flex-col gap-1.5 mt-1">
                    {[
                        { label: "8 characters minimum", met: hasMinLength },
                        { label: "a symbol", met: hasSymbol },
                        { label: "a number", met: hasNumber },
                    ].map(({ label, met }) => (
                        <div key={label} className="flex items-center gap-2">
                            <CheckIcon checked={met} />
                            <span className="text-xs text-gray-500">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Date of birth */}
            <div className="flex flex-col gap-1 w-full">
                <label className="text-sm font-medium text-gray-700">Date of birth</label>
                <input
                    type="text"
                    placeholder="dd/mm/yy"
                    value={birthDate}
                    onChange={e => setBirthDate(e.target.value)}
                    className="h-11 px-3 rounded-lg border border-gray-300 text-sm outline-none focus:border-gray-500 transition-colors placeholder:text-gray-400 w-full"
                />
            </div>

            {/* Continue */}
            <Button label="Continue" variant="primary" fullWidth type="submit" />

            {/* Divider */}
            <div className="flex items-center gap-3 w-full">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">Or</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google */}
            <Button label="Continue with Google" variant="dark" fullWidth icon={<GoogleIcon />} />

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 leading-relaxed">
                By continuing, you agree to the Esthetic{" "}
                <span className="underline cursor-pointer">Terms of Service</span> and
                acknowledge that you have read our{" "}
                <span className="underline cursor-pointer">Privacy Policy</span>. Notice
            </p>
        </div>
    );
};

export default RegisterForm;
