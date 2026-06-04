// src/components/PrivateRoute.tsx
import { useAppSelector } from "@/store";
import { Navigate, Outlet } from "react-router";

const PrivateRoute = () => {
    const user = useAppSelector((state) => state.auth.user);
    return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;