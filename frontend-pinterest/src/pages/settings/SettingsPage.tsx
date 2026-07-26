import { useNavigate, Link, Navigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store";
import { clearUser } from "@/store/slices/authSlice.ts";
import { api } from "@/services/api.ts";
import { useLogoutMutation } from "@/services/accountService.ts";
import { selectIsAdmin } from "@/store/selectors/authSelectors.ts";
import { APP_ENV } from "@/constants/env";
import ThemeToggle from "@/components/ui/ThemeToggle.tsx";
import LanguageSwitcher from "@/components/header/LanguageSwitcher.tsx";
import profileIcon from "@/assets/icons/profile_icon.svg";
import themeIcon from "@/assets/icons/theme_mode.svg";
import { useTranslation } from "react-i18next";
import { TrashIcon } from "@/components/ui/Icons.tsx";
import { useTheme } from "@/context/ThemeContext.tsx";

const whiteFilter = "brightness(0)";
const darkFilter = "brightness(0) invert(1)";

const SettingsPage = () => {
    const { t } = useTranslation('common');
    const { theme } = useTheme();

    if (window.innerWidth >= 768) return <Navigate to="/" replace />;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const isAdmin = useAppSelector(selectIsAdmin);
    const user = useAppSelector((state) => state.auth.user);
    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        try { await logout(); } catch {}
        dispatch(clearUser());
        dispatch(api.util.resetApiState());
        navigate("/");
    };

    return (
        <div className="flex flex-col px-4 py-6 gap-2 text-black dark:text-white">
            <h1 className="text-xl font-bold mb-4">{t('settings.title')}</h1>

            {user && (
                <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a] mb-2"
                >
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-[var(--color-btn-primary)] flex items-center justify-center">
                        {user.image
                            ? <img src={`${APP_ENV.IMAGES_100_URL}${user.image}`} className="w-full h-full object-cover" alt="Your profile" />
                            : <img src={profileIcon} style={{ filter: whiteFilter }} className="w-6 h-6" alt="" />
                        }
                    </div>
                    <div className="text-left flex-1">
                        <p className="font-semibold text-sm">{user.firstName} {user.lastName}</p>
                        <p className="text-[#A1A1A1] text-xs">{user.email}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            )}

            <div className="flex items-center justify-between w-full px-4 py-4 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d1d1d1] dark:bg-[#2a2a2a] flex items-center justify-center shrink-0">
                        <img src={themeIcon} style={{ filter: theme === "dark" ? darkFilter : whiteFilter }} className="w-5 h-5" alt="" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">{t('settings.theme')}</p>
                        <p className="text-[#A1A1A1] text-xs">{t('settings.themeDesc')}</p>
                    </div>
                </div>
                <ThemeToggle />
            </div>

            <div className="flex items-center justify-between w-full px-4 py-4 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#d1d1d1] dark:bg-[#2a2a2a] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{t('settings.language')}</p>
                        <p className="text-[#A1A1A1] text-xs">{t('settings.languageDesc')}</p>
                    </div>
                </div>
                <LanguageSwitcher />
            </div>

            {isAdmin && (
                <button
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a]"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#d1d1d1] dark:bg-[#2a2a2a] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>
                        </svg>
                    </div>
                    <div className="text-left flex-1">
                        <p className="text-sm font-medium">{t('settings.adminPanel')}</p>
                        <p className="text-[#A1A1A1] text-xs">{t('settings.adminPanelDesc')}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </button>
            )}

            <button
                onClick={() => navigate("/deleted-auras")}
                className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-[#f5f5f5] dark:bg-[#1a1a1a]"
            >
                <div className="w-10 h-10 rounded-xl bg-[#d1d1d1] dark:bg-[#2a2a2a] flex items-center justify-center shrink-0">
                    <TrashIcon size={18} strokeWidth={1.5} />
                </div>
                <div className="text-left flex-1">
                    <p className="text-sm font-medium">{t('settings.recentlyDeleted')}</p>
                    <p className="text-[#A1A1A1] text-xs">{t('settings.recentlyDeletedDesc')}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A1A1A1" strokeWidth="2">
                    <path d="M9 18l6-6-6-6"/>
                </svg>
            </button>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl bg-red-500/10 mt-2"
            >
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                </div>
                <div className="text-left">
                    <p className="text-red-500 text-sm font-medium">{t('settings.logout')}</p>
                    <p className="text-[#A1A1A1] text-xs">{t('settings.logoutDesc')}</p>
                </div>
            </button>

            <div className="border-t border-black/10 dark:border-white/10 mt-1 pt-3 flex items-center justify-center gap-3">
                <Link to="/news" className="text-xs text-[#A1A1A1] hover:text-[#1DB954] transition-colors">{t('nav.news')}</Link>
                <span className="text-[#A1A1A1] text-xs">·</span>
                <Link to="/about" className="text-xs text-[#A1A1A1] hover:text-[#1DB954] transition-colors">{t('nav.about')}</Link>
                <span className="text-[#A1A1A1] text-xs">·</span>
                <Link to="/business" className="text-xs text-[#A1A1A1] hover:text-[#1DB954] transition-colors">{t('nav.business')}</Link>
            </div>
        </div>
    );
};

export default SettingsPage;
