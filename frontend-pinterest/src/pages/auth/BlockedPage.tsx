import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/selectors/authSelectors.ts";
import Modal from "@/components/ui/Modal.tsx";
import LoginForm from "@/components/auth/LoginForm.tsx";
import RegisterForm from "@/components/auth/RegisterForm.tsx";
import Button from "@/components/button/Button.tsx";
import { useTheme } from "@/context/ThemeContext.tsx";
import { useTranslation } from "react-i18next";

type ModalType = "login" | "signup" | null;

const BlockedPage = () => {
    const { t } = useTranslation('common');
    const user = useSelector(selectUser);
    const { theme } = useTheme();
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-white dark:bg-[#121212]">
            <div className="w-16 h-16 mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-red-500 dark:text-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                </svg>
            </div>

            <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
                {t('blocked.title')}
            </h1>

            {user?.blockReason && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md">
                    {t('blocked.reason', { reason: user.blockReason })}
                </p>
            )}

            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                {t('blocked.contact')}
            </p>

            <div className="flex items-center gap-3">
                <Button
                    variant="primary"
                    size="md"
                    radius={10}
                    style={{ width: 100, height: 50 }}
                    onClick={() => setActiveModal("signup")}
                >
                    {t('actions.signUp')}
                </Button>
                <Button
                    variant={theme === "dark" ? "dark" : "light"}
                    size="md"
                    radius={10}
                    style={{ width: 100, height: 50 }}
                    onClick={() => setActiveModal("login")}
                >
                    {t('actions.logIn')}
                </Button>
            </div>

            <Modal isOpen={activeModal === "signup"} onClose={() => setActiveModal(null)}
                   width={450} height="auto" borderRadius={20}>
                <RegisterForm onSuccess={() => setActiveModal(null)} />
            </Modal>

            <Modal isOpen={activeModal === "login"} onClose={() => setActiveModal(null)}
                   width={450} height="auto" borderRadius={20}>
                <LoginForm
                    onSuccess={() => setActiveModal(null)}
                    onForgotPassword={() => setActiveModal(null)}
                />
            </Modal>
        </div>
    );
};

export default BlockedPage;