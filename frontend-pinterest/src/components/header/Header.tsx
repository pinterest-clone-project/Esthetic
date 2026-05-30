import logo from "../../../src/assets/logo.png";
import searchIcon from "../../../src/assets/search-vector.svg";
import Button from "@/components/button/Button.tsx";
import {useState} from "react";
import Modal from "@/components/UI/Modal.tsx";
import LoginForm from "@/components/auth/LoginForm.tsx";
import RegisterForm from "@/components/auth/RegisterForm.tsx";


type ModalType = "login" | "signup" | null;

const Header: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    return (
        <header className="w-full bg-black py-3">
            <div className="max-w-[1505px] h-[50px] mx-auto px-4 flex items-center justify-between gap-4
            ">

                <div className="flex items-center gap-3 shrink-0 hover:cursor-pointer">
                    <img
                        className="w-8 h-8"
                        src={logo}
                    />

                    <a
                        className="text-white font-bold text-xl leading-5 tracking-[-0.5px]"
                        href="/"
                    >
                        Esthetic
                    </a>
                </div>

                <div className="flex-1 justify-center">
                    <div className="flex items-center bg-[#535353] rounded-[10px] px-4 h-9 w-full max-w-[586px] h-[40px]">
                        <img
                            src={searchIcon}
                            className="w-[27px] h-[27px] opacity-70"
                        />

                        <input
                            className="bg-transparent text-sm outline-none text-white px-3 w-full"
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                </div>

                <nav className="hidden md:flex items-center gap-5 shrink-0">
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

                    <Button
                        variant="primary"
                        size="md"
                        radius={10}
                        style={{ width: 100, height: 50 }}
                        onClick={() => setActiveModal("signup")}
                    >
                        Sign Up
                    </Button>

                    <Button
                        variant="dark"
                        size="md"
                        radius={10}
                        style={{ width: 100, height: 50 }}
                        onClick={() => setActiveModal("login")}
                    >
                        Log in
                    </Button>

                </nav>
            </div>

            <Modal isOpen={activeModal === "signup"} onClose={() => setActiveModal(null)}
                    width={450} height={675} borderRadius={20}>
                <RegisterForm></RegisterForm>
            </Modal>

            <Modal isOpen={activeModal === "login"} onClose={() => setActiveModal(null)}
                   width={450} height={438} borderRadius={20}>
                <LoginForm></LoginForm>
            </Modal>

        </header>
    );
};

export default Header;