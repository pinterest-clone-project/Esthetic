import logo from "../../../src/assets/logo.png";
import searchIconDark from "../../assets/icons/search-vector-dark.svg";
import searchIconLight from "../../assets/icons/search-vector-light.svg";
import Button from "@/components/button/Button.tsx";
import {useEffect, useRef, useState} from "react";
import { useTranslation } from "react-i18next";
import LoginForm from "@/components/auth/LoginForm.tsx";
import RegisterForm from "@/components/auth/RegisterForm.tsx";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm.tsx";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm.tsx";
import {useAppDispatch, useAppSelector} from "@/store";
import userIcon from "../../../src/assets/icons/user_icon.svg";
import bellIcon from "@/assets/icons/bell_icon.svg";
import filterIconDark from "@/assets/icons/filter_icon_dark.svg";
import filterIconLight from "@/assets/icons/filter_icon_light.svg";
import {clearUser} from "@/store/slices/authSlice.ts";
import {APP_ENV} from "@/constants/env";
import {Link, useNavigate} from "react-router";
import { useLogoutMutation } from "@/services/accountService";
import { useGetNotificationsQuery } from "@/services/notificationService";
import {api} from "@/services/api.ts";
import {selectIsAdmin} from "@/store/selectors/authSelectors.ts";
import NotificationBell from "@/components/header/NotificationBell.tsx";
import {useTheme} from "@/context/ThemeContext.tsx";
import Modal from "@/components/ui/Modal.tsx";
import LanguageSwitcher from "@/components/header/LanguageSwitcher.tsx";

type ModalType = "login" | "signup" | "forgot-password" | "reset-password" | null;

const Header: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [resetEmail, setResetEmail] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLElement>(null);
    const user = useAppSelector((state) => state.auth.user);
    const isAdmin = useAppSelector(selectIsAdmin);
    const dispatch = useAppDispatch();
    const {theme} = useTheme();
    const navigate = useNavigate();

    const [logout] = useLogoutMutation();
    const { data: notificationsData } = useGetNotificationsQuery({}, { skip: !user });
    const unreadCount = (notificationsData?.items ?? []).filter((n) => !n.isRead).length;

    const { t } = useTranslation('common');

    useEffect(() => {
        if (user) setActiveModal(null);
    }, [user]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
            if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Помилка під час logout:", error);
        } finally {
            dispatch(clearUser());
            dispatch(api.util.resetApiState());
            setDropdownOpen(false);
            navigate("/");
        }
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && searchQuery.trim()) {
            navigate(`/aura/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };

    const submitSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/aura/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };


    return (
        <header ref={headerRef} className="sticky top-0 z-50 w-full bg-white dark:bg-black py-3 relative">
            <div className="max-w-[1505px] h-[50px] mx-auto px-4 flex items-center justify-between gap-4
            ">

                <div className="flex items-center gap-3 shrink-0 cursor-pointer -ml-1.5">
                    <img
                        className="w-11 h-11"
                        src={logo}
                        alt="Esthetic logo"
                    />

                    {!user && (
                        <a className="text-black dark:text-white font-bold text-xl leading-5 tracking-[-0.5px]" href="/">
                            Esthetic
                        </a>
                    )}
                </div>

                <div className={`flex-1 flex justify-center ${!user ? "hidden md:flex" : ""}`}>
                    <div className="flex items-center bg-[#A2A2A2] dark:bg-[#535353] hover:bg-[#949494] dark:hover:bg-[#5e5e5e] focus-within:bg-[#949494] dark:focus-within:bg-[#444] focus-within:ring-2 focus-within:ring-[#1DB954]/40 rounded-[10px] px-3 w-full max-w-[586px] h-[44px] transition-all duration-200 shadow-sm">
                        <button
                            onClick={submitSearch}
                            className="flex items-center justify-center w-8 h-8 rounded-[8px] hover:bg-white/10 transition-colors shrink-0"
                            aria-label="Search"
                        >
                            <img
                                src={theme === "dark" ? searchIconDark : searchIconLight}
                                alt=""
                                className="w-[20px] h-[20px] opacity-60"
                            />
                        </button>

                        <input
                            className="bg-transparent text-sm text-white outline-none placeholder:text-white/50 px-2 w-full"
                            type="text"
                            placeholder={t('placeholders.search')}
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />

                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="flex items-center justify-center w-7 h-7 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-black/50 dark:text-white/50">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        )}

                        <Link to="/aura/search" className="shrink-0">
                            <div className="flex items-center justify-center w-8 h-8 rounded-[8px] hover:bg-white/10 transition-colors ml-1">
                                <img src={theme === "dark" ? filterIconDark : filterIconLight} alt="" className="w-[22px] h-[22px] opacity-60" />
                            </div>
                        </Link>
                    </div>
                </div>

                {!user && (
                    <div className="flex md:hidden items-center gap-2 shrink-0">
                        <button
                            onClick={() => setMobileMenuOpen(o => !o)}
                            className="flex flex-col justify-center items-center w-9 h-9 gap-[5px]"
                            aria-label="Menu"
                        >
                            <span className={`block w-5 h-[2px] bg-black dark:bg-white rounded transition-all duration-300 origin-center ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
                            <span className={`block w-5 h-[2px] bg-black dark:bg-white rounded transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                            <span className={`block w-5 h-[2px] bg-black dark:bg-white rounded transition-all duration-300 origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
                        </button>
                        <Button variant="primary" size="sm" radius={10} style={{ width: 95, height: 36 }}
                                onClick={() => setActiveModal("signup")}>
                            {t('actions.signUp', 'Sign Up')}
                        </Button>
                        <Button variant={theme === "dark" ? "dark" : "light"} size="sm" radius={10} style={{ width: 80, height: 36 }}
                                onClick={() => setActiveModal("login")}>
                            {t('actions.logIn', 'Log in')}
                        </Button>
                    </div>
                )}

                {user && (
                    <div className="flex md:hidden items-center gap-2 shrink-0">
                        <Link to="/notifications">
                            <div className="relative flex items-center justify-center w-11 h-11">
                                <img src={bellIcon} className="w-[30px] h-[30px] opacity-70" alt={t('nav.notifications')} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-btn-primary text-[10px] font-bold text-black flex items-center justify-center">
                                        {unreadCount > 9 ? "9+" : unreadCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <Link to={"/user/" + user.id}>
                            <div className={`w-9 h-9 rounded-full overflow-hidden flex items-center justify-center
                                ${user.image ? "" : "bg-[var(--color-btn-primary)]"}`}>
                                {user.image ? (
                                    <img src={`${APP_ENV.IMAGES_100_URL}${user.image}`} className="w-full h-full object-cover" alt="Your profile" />
                                ) : (
                                    <img src={userIcon} className="w-5 h-6 object-contain" alt="" />
                                )}
                            </div>
                        </Link>
                    </div>
                )}

                <nav className="hidden md:flex items-center gap-5 shrink-0">
                    <LanguageSwitcher />
                    {!user && (
                        <div className="hidden lg:flex items-center gap-5">
                            <Link to="/about" className="text-black dark:text-white hover:text-[#1DB954] cursor-pointer transition font-normal text-sm leading-5 tracking-[-0.5px]">
                                {t('nav.about', 'About Us')}
                            </Link>
                            <Link to="/business" className="text-black dark:text-white text-sm hover:text-[#1DB954] cursor-pointer transition font-normal leading-5 tracking-[-0.5px]">
                                {t('nav.business', 'For Business')}
                            </Link>
                            <Link to="/news" className="text-black dark:text-white text-sm hover:text-[#1DB954] cursor-pointer transition font-normal leading-5 tracking-[-0.5px]">
                                {t('nav.news', 'News')}
                            </Link>
                        </div>
                    )}

                    {user ? (
                        <div className="flex items-center gap-14">

                            <NotificationBell />

                            <div className="relative" ref={dropdownRef}>
                                <div className="flex items-center gap-1">
                                    <Link to={"/user/" + user.id}>
                                        <div  className={`w-11 h-11 rounded-full flex items-center justify-center overflow-hidden
                                            ${user.image ? "" : "bg-[var(--color-btn-primary)]"}`}>
                                            {user.image ? (
                                                <img
                                                    src={`${APP_ENV.IMAGES_100_URL}${user.image}`}
                                                    className="w-full h-full object-cover rounded-full"
                                                    alt="Your profile"
                                                />
                                            ) : (
                                                <img src={userIcon} className="w-5 h-6 object-contain" alt="" />
                                            )}
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="cursor-pointer"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme === "dark" ? "#FFFFFF" : "#000000"} strokeWidth="2">
                                            <path d="M6 9l6 6 6-6"/>
                                        </svg>
                                    </button>
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute right-0 top-12 bg-white dark:bg-[#1a1a1a] rounded-[10px] shadow-2xl w-48 z-50 border border-[#A1A1A1] dark:border-[#535353] animate-[dropdownIn_0.2s_ease] overflow-hidden">
                                        <div className="px-4 py-2.5 border-b border-[#A1A1A1] dark:border-[#535353]">
                                            <p className="text-black dark:text-white text-sm font-medium">{user?.firstName}</p>
                                            <p className="text-[#A1A1A1] text-xs">{user?.email}</p>
                                        </div>

                                        {isAdmin && (
                                            <button
                                                onClick={() => {
                                                    setDropdownOpen(false);
                                                    navigate("/admin");
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm text-black dark:text-white hover:bg-[#D1D1D1] dark:hover:bg-[#535353] transition flex items-center gap-2 cursor-pointer"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/>
                                                </svg>
                                                {t('nav.admin')}
                                            </button>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-3 text-left text-sm text-red-700 dark:text-red-400 cursor-pointer hover:bg-[#D1D1D1] dark:hover:bg-[#535353] transition flex items-center gap-2"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16 17 21 12 16 7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <>
                            <Button variant="primary" size="md" radius={10} style={{ width: 100, height: 50 }}
                                    onClick={() => setActiveModal("signup")}>
                                {t('actions.signUp', 'Sign Up')}
                            </Button>
                            <Button variant={theme === "dark" ? "dark" : "light"} size="md" radius={10} style={{ width: 100, height: 50 }}
                                    onClick={() => setActiveModal("login")}>
                                {t('actions.logIn', 'Log in')}
                            </Button>
                        </>
                    )}

                </nav>
            </div>

            {!user && mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-t border-black/10 dark:border-white/10 shadow-lg z-40 animate-[slideDown_0.2s_ease]">
                    <div className="px-6 py-4 flex flex-col gap-1">
                        <div className="pb-3 border-b border-black/10 dark:border-white/10">
                            <LanguageSwitcher />
                        </div>
                        <Link
                            to="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-3 text-black dark:text-white text-sm font-medium border-b border-black/10 dark:border-white/10 hover:text-[#1DB954] transition-colors"
                        >
                            {t('nav.about', 'About Us')}
                        </Link>
                        <Link
                            to="/business"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-3 text-black dark:text-white text-sm font-medium border-b border-black/10 dark:border-white/10 hover:text-[#1DB954] transition-colors"
                        >
                            {t('nav.business', 'For Business')}
                        </Link>
                        <Link
                            to="/news"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-3 text-black dark:text-white text-sm font-medium hover:text-[#1DB954] transition-colors"
                        >
                            {t('nav.news', 'News')}
                        </Link>
                    </div>
                </div>
            )}

            {!user && (
                <>
                    <Modal isOpen={activeModal === "signup"} onClose={() => setActiveModal(null)}
                           width={450} height="auto" borderRadius={20}>
                        <RegisterForm onSuccess={() => setActiveModal(null)} />
                    </Modal>

                    <Modal isOpen={activeModal === "login"} onClose={() => setActiveModal(null)}
                           width={450} height="auto" borderRadius={20}>
                        <LoginForm
                            onSuccess={() => setActiveModal(null)}
                            onForgotPassword={() => setActiveModal("forgot-password")}
                        />
                    </Modal>

                    <Modal isOpen={activeModal === "forgot-password"} onClose={() => setActiveModal(null)}
                           width={450} height="auto" borderRadius={20}>
                        <ForgotPasswordForm
                            onSuccess={(email) => {
                                setResetEmail(email);
                                setActiveModal("reset-password");
                            }}
                            onBack={() => setActiveModal("login")}
                        />
                    </Modal>

                    <Modal isOpen={activeModal === "reset-password"} onClose={() => setActiveModal(null)}
                           width={450} height="auto" borderRadius={20}>
                        <ResetPasswordForm
                            email={resetEmail}
                            onSuccess={() => {
                                setResetEmail("");
                                setActiveModal("login");
                            }}
                            onBack={() => setActiveModal("forgot-password")}
                        />
                    </Modal>
                </>
            )}

        </header>
    );
};

export default Header;
