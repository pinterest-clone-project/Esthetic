import Header from "../components/header/Header.tsx";
import { Outlet, useLocation } from "react-router";
import Sidebar from "@/components/sidebar/SideBar.tsx";
import { useAppSelector } from "@/store";
import TopProgressBar from "@/components/ui/TopProgressBar.tsx";
import BottomNav from "@/components/navigation/BottomNav.tsx";
import BackButton from "@/components/ui/BackButton.tsx";

const BACK_BUTTON_ROUTES = [
    /^\/profile$/,
    /^\/user\/.+$/,
    /^\/settings$/,
    /^\/notifications$/,
    /^\/aura\/create$/,
    /^\/aura\/edit\/.+$/,
    /^\/aura\/preview\/.+$/,
    /^\/moodboard\/preview\/.+$/,
];

const Layout = () => {
    const user = useAppSelector((state) => state.auth.user);
    const { pathname } = useLocation();
    const showBack = BACK_BUTTON_ROUTES.some((r) => r.test(pathname));

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-white dark:bg-black">
            <TopProgressBar />
            <Header />
            <div className="flex flex-1 max-w-[1505px] mx-auto w-full min-h-0">
                {user && <Sidebar />}
                <main className="flex-1 px-4 overflow-y-auto scroll-smooth pb-20 md:pb-0 main-scroll">
                    {showBack && <BackButton className="mt-4 mb-2" />}
                    <Outlet />
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Layout;