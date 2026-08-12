import { useState } from "react";
import { createPortal } from "react-dom";
import { useAppDispatch } from "@/store";
import { setUser } from "@/store/slices/authSlice";
import { useEditProfileMutation } from "@/services/accountService";
import { useTranslation } from "react-i18next";
import { useLoading } from "@/context/LoadingContext";

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/i;

export const UsernameSetupModal = () => {
    const { t } = useTranslation("common");
    const dispatch = useAppDispatch();
    const [editProfile] = useEditProfileMutation();
    const { withLoading } = useLoading();
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const validate = (v: string) => {
        if (v.length < 3) return t("usernameSetup.errorMin");
        if (!USERNAME_REGEX.test(v)) return t("usernameSetup.errorInvalid");
        return null;
    };

    const handleSave = async () => {
        const err = validate(value);
        if (err) { setError(err); return; }
        try {
            const updated = await withLoading(() => editProfile({ userName: value }).unwrap());
            dispatch(setUser(updated));
        } catch {
            setError(t("usernameSetup.errorTaken"));
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-8 w-full max-w-sm mx-4 shadow-2xl">
                <h2 className="text-black dark:text-white font-bold text-xl mb-1">
                    {t("usernameSetup.title")}
                </h2>
                <p className="text-[#888] text-sm mb-6">
                    {t("usernameSetup.subtitle")}
                </p>

                <div className="flex flex-col gap-2 mb-4">
                    <label className="text-black dark:text-white text-sm font-medium">
                        {t("usernameSetup.label")}
                    </label>
                    <input
                        value={value}
                        onChange={(e) => { setValue(e.target.value); setError(null); }}
                        onKeyDown={(e) => e.key === "Enter" && handleSave()}
                        placeholder={t("usernameSetup.placeholder")}
                        maxLength={30}
                        className="bg-[#f0f0f0] dark:bg-[#2a2a2a] text-black dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1DB954] transition-all placeholder:text-[#888]"
                        autoFocus
                    />
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                </div>

                <button
                    onClick={handleSave}
                    disabled={value.trim().length < 3}
                    className="w-full bg-[#1DB954] text-black font-semibold text-sm py-3 rounded-xl disabled:opacity-40 transition-opacity hover:brightness-95"
                >
                    {t("usernameSetup.save")}
                </button>
            </div>
        </div>,
        document.body
    );
};
