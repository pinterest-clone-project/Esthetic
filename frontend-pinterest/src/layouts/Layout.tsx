import Header from "../components/header/Header.tsx";
import { Outlet } from "react-router";
import Sidebar from "@/components/sidebar/SideBar.tsx";
import { useAppSelector } from "@/store";
import TopProgressBar from "@/components/ui/TopProgressBar.tsx";
import BottomNav from "@/components/navigation/BottomNav.tsx";

const Layout = () => {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-black">
            <TopProgressBar />
            <Header />
            <div className="flex flex-1 min-h-0 max-w-[1505px] mx-auto w-full">
                {user && <Sidebar />}
                <main className="flex-1 px-4 pb-20 md:pb-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <Outlet />
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Layout;