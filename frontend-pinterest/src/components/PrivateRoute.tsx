import { useAppSelector } from "@/store";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
    const user = useAppSelector((state) => state.auth.user);
    const isLoading = useAppSelector((state) => state.auth.isLoading);

    if (isLoading) return null;
    return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;