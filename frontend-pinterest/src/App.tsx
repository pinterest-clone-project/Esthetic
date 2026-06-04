import {Route, Routes} from "react-router";
import HomePage from "./pages/home/HomePage.tsx";
import NotFoundPage from "./pages/NotFoundPage.tsx";
import Layout from "./layout/Layout.tsx";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "./store";
import {setLoading, setUser} from "./store/slices/authSlice";
import { useGetMeQuery } from "./services/accountService";
import ProfilePage from "@/pages/profile/ProfilePage.tsx";
import PrivateRoute from "@/components/PrivateRoute.tsx";
import Spinner from "@/components/Spinner.tsx";

const AppInit = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { data, isSuccess, isLoading } = useGetMeQuery(undefined, { skip: false, });
    const globalLoading = useAppSelector((state) => state.auth.isLoading);

    useEffect(() => {
        dispatch(setLoading(isLoading));
    }, [isLoading]);

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setUser(data));
        }
    }, [isSuccess, data, dispatch]);

    return (
        <>
            {globalLoading && <Spinner />}
            {children}
        </>
    );
};


const App = () => {

  return (
    <AppInit>
      <Routes>
          <Route element={<Layout/>}>
              <Route path="/">
                  <Route index element={<HomePage />} />
              </Route>

              <Route element={<PrivateRoute />}>
                  <Route path="/profile">
                      <Route index element={<ProfilePage />} />
                  </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
          </Route>

      </Routes>
    </AppInit>
  )
}

export default App
