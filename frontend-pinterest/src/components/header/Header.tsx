import logo from "../../../src/assets/logo.png";
import searchIcon from "../../../src/assets/search-vector.svg";

const Header: React.FC = () => {
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

                    <button className="min-w-[100px] min-h-[50px] bg-green-500 hover:bg-green-400  px-4 py-1.5 rounded-md text-sm font-medium transition">
                        <a className={"font-normal text-sm leading-5 text-black tracking-[-0.5px]"}
                           href="/signup">
                            Sign Up
                        </a>
                    </button>

                    <button className="min-w-[100px] min-h-[50px] bg-[#535353] hover:border-zinc-400 px-4 py-1.5 rounded-md text-sm transition"
                    >
                        <a className={"font-normal text-sm leading-5 text-black tracking-[-0.5px]"}
                        href="/login">
                            Login
                        </a>
                    </button>
                </nav>

            </div>
        </header>
    );
};

export default Header;