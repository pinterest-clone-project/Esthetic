import Header from "../header/Header.tsx";
import { Outlet } from "react-router";
import Sidebar from "@/components/sidebar/SideBar.tsx";
import {useAppSelector} from "@/store";

const Layout = () => {
    const user = useAppSelector((state) => state.auth.user);
    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Header />
            <div className="flex flex-1 max-w-[1505px] mx-auto w-full">
                {user && <Sidebar />}
                <main className="flex-1 px-4 scroll-smooth">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default Layout;
