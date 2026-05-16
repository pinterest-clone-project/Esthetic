import React, { useState } from "react";
import {Link, useNavigate} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {useGoogleLoginMutation, useLoginMutation} from "@/services/accountService.ts";
import {useGoogleLogin} from "@react-oauth/google";
import Button from "@/components/button/Button.tsx";
import GoogleIcon from "@/asssets/icons/GoogleIcon.tsx";


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [login, {isLoading, error}] = useLoginMutation();
    const [loginByGoogle, {isLoading: isGoogleLoading}] = useGoogleLoginMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const result = await login({ email, password }).unwrap();

            const base64Payload = result.accessToken.split('.')[1];
            const decoded = JSON.parse(atob(base64Payload));

            console.log('🔑 Access Token:', result.accessToken);
            console.log('📦 Token payload:', decoded);

            localStorage.setItem("token", result.accessToken);
        } catch (err) {
            console.error("Login failed", err);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const result = await loginByGoogle({ token: tokenResponse.access_token }).unwrap();
                localStorage.setItem("token", result.accessToken);

                const base64Payload = result.accessToken.split('.')[1];
                const decoded = JSON.parse(atob(base64Payload));
                console.log('🔑 Google Access Token:', result.accessToken);
                console.log('📦 Google Token payload:', decoded);


                navigate('/');
            } catch (error) {
                console.error("Google login failed", error);
            }
        },
    });

    return (
        <div className="flex flex-col dark:bg-gray-950 lg:flex-row min-h-screen bg-white">


            <div className="w-full lg:w-1/2 flex flex-col justify-center mt-10 px-10 md:px-24 lg:px-32">
                <div className="max-w-md w-full mx-auto">
                    <div className="mb-2 text-center lg:text-left">
                        <h2 className="text-3xl dark:text-white font-bold text-slate-900">Вхід</h2>
                        <p className="text-slate-500 dark:text-white mt-2">
                            Ще не маєте акаунту? {" "}
                            <Link to="/account/register" className="text-amber-300 font-semibold hover:underline">
                                Реєстрація
                            </Link>
                        </p>
                    </div>


                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-slate-200"></div>
                        <span className="flex-shrink mx-4 text-slate-400 text-sm">or</span>
                        <div className="flex-grow border-t border-slate-200"></div>
                    </div>


                    {/* Форма */}
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        <div>
                            <label className="block dark:text-white text-sm font-bold text-slate-700 mb-2 uppercase tracking-tight">
                                Email *
                            </label>
                            <input
                                type="email"
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm dark:text-white font-bold text-slate-700 uppercase tracking-tight">
                                    Password *
                                </label>
                                <a href="forgot-password" className="text-sm text-slate-400 hover:text-amber-300 transition">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900
                                   border border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white
                                  focus:outline-none focus:ring-2 focus:ring-yellow-400/20 focus:border-yellow-400 transition-all"
                                    placeholder="Your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    // При натисканні змінюємо true на false і навпаки
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {/* Змінюємо іконку залежно від стану */}
                                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            label={isLoading ? "Вхід..." : "Увійти"}
                            disabled={isLoading}
                            fullWidth
                        />

                        <Button
                            type="button"
                            label={isGoogleLoading ? "Авторизація..." : "Увійти через Google"}
                            disabled={isGoogleLoading}
                            variant="dark"
                            fullWidth
                            onClick={() => loginWithGoogle()}
                            icon= {<GoogleIcon/>}
                        />

                        {error && <p style={{ color: "red" }}>Invalid email or password</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
