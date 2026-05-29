import Header from "../components/header/Header";
import { Outlet } from "react-router";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
