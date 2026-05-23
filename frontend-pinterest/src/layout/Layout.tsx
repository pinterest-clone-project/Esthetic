import Header from "../components/header/Header";
import {Outlet} from "react-router";

const Layout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default Layout;