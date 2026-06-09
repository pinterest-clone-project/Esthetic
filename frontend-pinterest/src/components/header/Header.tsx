import logo from "../../../src/assets/logo.png";
import searchIcon from "../../assets/icons/search-vector.svg";
import Button from "@/components/button/Button.tsx";
import {useEffect, useRef, useState} from "react";
import Modal from "@/components/UI/Modal.tsx";
import LoginForm from "@/components/auth/LoginForm.tsx";
import RegisterForm from "@/components/auth/RegisterForm.tsx";
import {useAppDispatch, useAppSelector} from "@/store";
import bellIcon from "../../../src/assets/icons/bell_icon.svg";
import userIcon from "../../../src/assets/icons/user_icon.svg";
import {clearUser} from "@/store/slices/authSlice.ts";
import {APP_ENV} from "@/constants/env";
import {Link, useNavigate} from "react-router";
import { useLogoutMutation } from "@/services/accountService";
import {api} from "@/services/api.ts";


type ModalType = "login" | "signup" | null;

const Header: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [logout] = useLogoutMutation();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
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

    return (
        <header className="sticky top-0 z-50 w-full bg-black py-3">
            <div className="max-w-[1505px] h-[50px] mx-auto px-4 flex items-center justify-between gap-4
            ">

                <div className="flex items-center gap-3 shrink-0 hover:cursor-pointer">
                    <img
                        className="w-11 h-11"
                        src={logo}
                    />

                    {!user && (
                        <a className="text-white font-bold text-xl leading-5 tracking-[-0.5px]" href="/">
                            Esthetic
                        </a>
                    )}
                </div>

                <div className="flex-1 flex justify-center">
                    <div className="flex items-center bg-[#535353] rounded-[10px] px-4 h-9 w-full max-w-[586px] h-[40px]">
                        <img
                            src={searchIcon}
                            className="w-[27px] h-[27px] opacity-70 hover:cursor-pointer"
                        />

                        <input
                            className="bg-transparent text-sm outline-none text-white px-3 w-full"
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-5 shrink-0">
                    {!user && (
                        <div className="hidden lg:flex items-center gap-5">
                            <a className="text-white hover:text-green-400 hover:cursor-pointer transition font-normal text-sm leading-5 tracking-[-0.5px]">
                                About Us
                            </a>
                            <a className="text-white text-sm hover:text-green-400 hover:cursor-pointer transition font-normal leading-5 tracking-[-0.5px]">
                                For Business
                            </a>
                            <a className="text-white text-sm hover:text-green-400 hover:cursor-pointer transition font-normal leading-5 tracking-[-0.5px]">
                                News
                            </a>
                        </div>
                    )}

                    {user ? (
                        <div className="flex items-center gap-14">
                            <button className="text-[#A1A1A1] hover:text-white transition">
                                <img src={bellIcon} className="w-[30px] h-[30px] opacity-70 hover:opacity-100" />
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <div className="flex items-center gap-1">
                                    <Link to="/profile">
                                        <div className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden">
                                            {user.image ? (
                                                <img
                                                    src={`${APP_ENV.IMAGES_100_URL}${user.image}`}
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <img src={userIcon} className="w-5 h-5" />
                                            )}
                                        </div>
                                    </Link>
                                    <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
                                            <path d="M6 9l6 6 6-6"/>
                                        </svg>
                                    </button>
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute right-0 top-12 bg-[#1a1a1a] rounded-[10px] shadow-2xl w-48 py-2 z-50 border border-[#535353]">
                                        <div className="px-4 py-2 border-b border-[#535353] mb-1">
                                            <p className="text-white text-sm font-medium">{user?.firstName}</p>
                                            <p className="text-[#A1A1A1] text-xs">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#535353] transition flex items-center gap-2"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                                <polyline points="16 17 21 12 16 7"/>
                                                <line x1="21" y1="12" x2="9" y2="12"/>
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        <>
                            <Button variant="primary" size="md" radius={10} style={{ width: 100, height: 50 }}
                                    onClick={() => setActiveModal("signup")}>
                                Sign Up
                            </Button>
                            <Button variant="dark" size="md" radius={10} style={{ width: 100, height: 50 }}
                                    onClick={() => setActiveModal("login")}>
                                Log in
                            </Button>
                        </>
                    )}

                </nav>
            </div>

            <Modal isOpen={activeModal === "signup"} onClose={() => setActiveModal(null)}
                   width={450} height="auto" borderRadius={20}>
                <RegisterForm onSuccess={() => setActiveModal(null)} />
            </Modal>

            <Modal isOpen={activeModal === "login"} onClose={() => setActiveModal(null)}
                   width={450} height={438} borderRadius={20}>
                <LoginForm onSuccess={() => setActiveModal(null)} />
            </Modal>

        </header>
    );
};

export default Header;