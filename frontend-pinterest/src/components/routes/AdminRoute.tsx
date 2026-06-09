import {selectIsAdmin, selectIsAuth} from "@/store/selectors/authSelectors.ts";
import {useAppSelector} from "@/store";
import {Navigate, Outlet} from "react-router";

const AdminRoute = () => {
    const isAuth  = useAppSelector(selectIsAuth);
    const isAdmin = useAppSelector(selectIsAdmin);

    if (!isAuth)  return <Navigate to="/" replace />;
    if (!isAdmin) return <Navigate to="/" replace />;

    return <Outlet />;
};

export default AdminRoute;